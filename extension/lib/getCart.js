const ShopgateCartPipeline = require('./shopgate/CartExtensionPipeline')

/**
 * @param {PipelineContext} context
 * @returns {Promise<ShopgateGetCartResponse>}
 */
module.exports = async (context) => {
  const cartPipeline = ShopgateCartPipeline.create(context)
  try {
    const cartPipelineResponse = await cartPipeline.get()
    context.log.debug(cartPipelineResponse)
    return cartPipelineResponse
  } catch (error) {
    context.log.error(error)
    throw error
  }
}
