var HeaderElementAttribute;
(function (HeaderElementAttribute) {
    HeaderElementAttribute["Title"] = "title";
})(HeaderElementAttribute || (HeaderElementAttribute = {}));
export class HeaderElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.titleElement = document.createElement('h2');
    }
    get title() {
        return this.getAttribute(HeaderElementAttribute.Title);
    }
    set title(title) {
        this.setAttribute(HeaderElementAttribute.Title, title);
    }
    connectedCallback() {
        this.appendChild(this.createLeftSide());
        this.appendChild(this.createRightSide());
    }
    attributeChangedCallback(name) {
        switch (name) {
            case HeaderElementAttribute.Title: {
                this.titleElement.textContent = this.title;
                break;
            }
        }
    }
    createLeftSide() {
        const leftSide = document.createElement('div');
        const homeLink = document.createElement('a');
        const homeLinkText = document.createElement('h2');
        homeLink.href = '/';
        homeLinkText.textContent = 'Nx Store';
        homeLink.appendChild(homeLinkText);
        leftSide.appendChild(homeLink);
        this.titleElement.textContent = this.title;
        leftSide.appendChild(this.titleElement);
        return leftSide;
    }
    createRightSide() {
        const githubLink = document.createElement('a');
        const icon = document.createElement('span');
        githubLink.href = 'https://github.com/nrwl/nx-shopss';
        icon.classList.add('icon', 'icon-github');
        githubLink.appendChild(icon);
        const rightSide = document.createElement('div');
        rightSide.appendChild(githubLink);
        return rightSide;
    }
}
HeaderElement.observedAttributes = [HeaderElementAttribute.Title];
customElements.define('nx-shops-header', HeaderElement);
