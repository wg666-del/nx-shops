var ProductPriceElementAttribute;
(function (ProductPriceElementAttribute) {
    ProductPriceElementAttribute["Value"] = "value";
})(ProductPriceElementAttribute || (ProductPriceElementAttribute = {}));
export class ProductPriceElement extends HTMLElement {
    get displayPrice() {
        return '$' + (this.value / 100).toFixed(2);
    }
    get value() {
        return +this.getAttribute(ProductPriceElementAttribute.Value);
    }
    set value(price) {
        this.setAttribute(ProductPriceElementAttribute.Value, price.toString());
    }
    attributeChangedCallback(name) {
        switch (name) {
            case ProductPriceElementAttribute.Value: {
                this.textContent = this.displayPrice;
                break;
            }
        }
    }
}
ProductPriceElement.observedAttributes = [ProductPriceElementAttribute.Value];
customElements.define('nx-shops-product-price', ProductPriceElement);
