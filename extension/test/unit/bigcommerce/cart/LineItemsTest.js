'use strict'
const assert = require('assert')
const chai = require('chai')
const BigCommerceCartLineItems = require('../../../../lib/bigcommerce/cart/LineItems')
const BigCommerceCartLineItemPhysical = require('../../../../lib/bigcommerce/cart/line_item/Physical')
const BigCommerceCartLineItemDigital = require('../../../../lib/bigcommerce/cart/line_item/Digital')
const BigCommerceCartLineItemGiftCertificate = require('../../../../lib/bigcommerce/cart/line_item/GiftCertificate')

chai.use(require('chai-subset'))
chai.use(require('chai-as-promised')).should()

describe('LineItems - unit', function () {
  let subjectUnderTest

  beforeEach(() => {
    subjectUnderTest = new BigCommerceCartLineItems()
  })

  it('should give back only digital items when other types of line items are present', function () {
    subjectUnderTest.add(new BigCommerceCartLineItemPhysical())
    subjectUnderTest.add(new BigCommerceCartLineItemDigital())
    subjectUnderTest.add(new BigCommerceCartLineItemGiftCertificate())

    subjectUnderTest.digital.forEach((item) => item.should.be.instanceOf(BigCommerceCartLineItemDigital))
  })

  it('should give back only physical items when other types of line items are present', function () {
    subjectUnderTest.add(new BigCommerceCartLineItemPhysical())
    subjectUnderTest.add(new BigCommerceCartLineItemDigital())
    subjectUnderTest.add(new BigCommerceCartLineItemGiftCertificate())

    subjectUnderTest.physical.forEach((item) => item.should.be.instanceOf(BigCommerceCartLineItemPhysical))
  })

  it('should give back only gift certificates items when other types of line items are present', function () {
    subjectUnderTest.add(new BigCommerceCartLineItemPhysical())
    subjectUnderTest.add(new BigCommerceCartLineItemDigital())
    subjectUnderTest.add(new BigCommerceCartLineItemGiftCertificate())

    subjectUnderTest.giftCertificates.forEach((item) => item.should.be.instanceOf(BigCommerceCartLineItemGiftCertificate))
  })

  it('should return null in case line item can not be found', function () {
    assert.strict.equal(subjectUnderTest.find('sample id'), null)
  })

  it('should return line item in case it should be found', function () {
    const exampleLineItem = new BigCommerceCartLineItemPhysical('1234-5678-9000-7898')
    subjectUnderTest.add(exampleLineItem)
    subjectUnderTest.find('1234-5678-9000-7898').should.deep.equal(exampleLineItem)
  })
})
