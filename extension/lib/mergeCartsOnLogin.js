'use strict'

const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')
const IdentifierConverter = require('./shopgate/IdentifierConverter')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {Object} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    const anonymousPipeline = ShopgateCartPipeline.createForDevice(context)
    const loggedInPipeline = ShopgateCartPipeline.createForUser(context)

    const anonymousCartId = await anonymousPipeline.getCartId()
    const loggedInUserCartId = await loggedInPipeline.getCartId()
    if (!loggedInUserCartId && !anonymousCartId) {
      return
    }

    // if there is no user cart id available, we can just reuse the one we have from the device and we're done.
    if (!loggedInUserCartId) {
      await anonymousPipeline.setCartId(null)
      await loggedInPipeline.setCartId(anonymousCartId)
      return
    }

    const itemsToAdd = (await anonymousPipeline.get()).cartItems.map(item => ({
      productId: IdentifierConverter.joinProductIds(item.product.id, item.product.variantId),
      quantity: item.quantity
    }))

    await loggedInPipeline.addProducts(itemsToAdd)
    await anonymousPipeline.destroyCart()
  } catch (error) {
    // if this fails, it shouldn't break the login
    context.log.error(decorateError(error), 'Failed merging carts on login')
  }
}
