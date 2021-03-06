'use strict'

const BigCommerceFactory = require('./bigcommerce/Factory')
const { decorateError } = require('./shopgate/logDecorator')

/**
 * @param {PipelineContext} context
 * @param {markOrderAsShopgateInput} input
 * @returns {Promise<void>}
 */
module.exports = async (context, input) => {
  try {
    const apiClientV2 = BigCommerceFactory.createV2(
      context.config.clientId,
      context.config.accessToken,
      context.config.storeHash
    )

    await apiClientV2.put(`/orders/${input.orderId}`, {
      staff_notes: 'Order placed via Shopgate App'
    })
  } catch (error) {
    context.log.error(decorateError(error), 'Failed marking the order as placed by Shopgate')
    throw new Error()
  }
}
