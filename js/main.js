/**
 * E-commerce Product Page Application
 * Structured using modern JavaScript patterns with classes and modules
 */

// Constants and Configuration
const CONFIG = {
    PRODUCT: {
        name: "Fall Limited Edition Sneakers",
        price: 125.00,
        totalImages: 4,
        basePath: "./images/"
    },
    SELECTORS: {
        // Menu elements
        menuBtn: "#menu-btn",
        closeBtn: ".close-btn",
        menu: ".nav_links",
        overlay: ".overlay",
        
        // Image gallery elements
        mainThumbnail: ".main-thumbnail",
        mainThumbnailLightBox: ".lightbox-container .main-thumbnail",
        previewImages: ".preview img",
        
        // Quantity controls
        plusBtn: "#plus",
        minusBtn: "#minus",
        amount: ".amount",
        
        // Mobile slider
        nextBtn: "#next",
        prevBtn: "#previous",
        thumbMob: ".thumb-mob",
        
        // Cart elements
        cartBtn: ".cart-btn",
        cart: ".cart-wrp",
        cartContent: ".cart-content",
        indicator: ".indicator",
        addBtn: ".add_btn",
        
        // Lightbox elements
        lightbox: ".lightbox",
        closeLightboxBtn: ".close-lightbox"
    }
};

/**
 * Utility class for DOM operations
 */
class DOMUtils {
    static $(selector) {
        return document.querySelector(selector);
    }
    
    static $$(selector) {
        return document.querySelectorAll(selector);
    }
    
    static addClass(element, className) {
        element?.classList.add(className);
    }
    
    static removeClass(element, className) {
        element?.classList.remove(className);
    }
    
    static toggleClass(element, className) {
        element?.classList.toggle(className);
    }
    
    static hide(element) {
        if (element) element.style.display = "none";
    }
    
    static show(element, display = "block") {
        if (element) element.style.display = display;
    }
}

/**
 * Menu management class
 */
class MenuManager {
    constructor() {
        this.menuBtn = DOMUtils.$(CONFIG.SELECTORS.menuBtn);
        this.closeBtn = DOMUtils.$(CONFIG.SELECTORS.closeBtn);
        this.menu = DOMUtils.$(CONFIG.SELECTORS.menu);
        this.overlay = DOMUtils.$(CONFIG.SELECTORS.overlay);
        
        this.init();
    }
    
    init() {
        this.menuBtn?.addEventListener("click", () => this.open());
        this.closeBtn?.addEventListener("click", () => this.close());
        this.overlay?.addEventListener("click", () => this.close());
    }
    
    open() {
        DOMUtils.addClass(this.menu, "active");
        DOMUtils.addClass(this.overlay, "active");
    }
    
    close() {
        DOMUtils.removeClass(this.menu, "active");
        DOMUtils.removeClass(this.overlay, "active");
    }
}

/**
 * Image gallery management class
 */
class ImageGallery {
    constructor() {
        this.currentImg = 1;
        this.mainThumbnail = DOMUtils.$(CONFIG.SELECTORS.mainThumbnail);
        this.mainThumbnailLightBox = DOMUtils.$(CONFIG.SELECTORS.mainThumbnailLightBox);
        this.previewImages = DOMUtils.$$(CONFIG.SELECTORS.previewImages);
        this.thumbMob = DOMUtils.$(CONFIG.SELECTORS.thumbMob);
        this.nextBtn = DOMUtils.$(CONFIG.SELECTORS.nextBtn);
        this.prevBtn = DOMUtils.$(CONFIG.SELECTORS.prevBtn);
        
        this.init();
    }
    
    init() {
        this.setupThumbnailClicks();
        this.nextBtn?.addEventListener("click", () => this.nextImage());
        this.prevBtn?.addEventListener("click", () => this.prevImage());
    }
    
    setupThumbnailClicks() {
        this.previewImages.forEach(image => {
            image.addEventListener("click", () => this.selectImage(image));
        });
    }
    
    selectImage(selectedImage) {
        // Remove previous selection
        const previousSelected = DOMUtils.$(".selected");
        if (previousSelected) {
            DOMUtils.removeClass(previousSelected, "selected");
        }
        
        // Add selection to clicked image
        DOMUtils.addClass(selectedImage, "selected");
        
        // Update main images
        const imagePath = this.getMainImagePath(selectedImage.src);
        if (imagePath) {
            this.updateMainImages(imagePath);
        }
    }
    
    getMainImagePath(thumbnailSrc) {
        const imageNumber = this.extractImageNumber(thumbnailSrc);
        return imageNumber ? `${CONFIG.PRODUCT.basePath}image-product-${imageNumber}.jpg` : null;
    }
    
    extractImageNumber(src) {
        const match = src.match(/image-product-(\d+)-thumbnail/);
        return match ? match[1] : null;
    }
    
    updateMainImages(imagePath) {
        if (this.mainThumbnail) this.mainThumbnail.src = imagePath;
        if (this.mainThumbnailLightBox) this.mainThumbnailLightBox.src = imagePath;
    }
    
    nextImage() {
        this.currentImg = this.currentImg === CONFIG.PRODUCT.totalImages ? 1 : this.currentImg + 1;
        this.updateMobileImage();
    }
    
    prevImage() {
        this.currentImg = this.currentImg === 1 ? CONFIG.PRODUCT.totalImages : this.currentImg - 1;
        this.updateMobileImage();
    }
    
    updateMobileImage() {
        if (this.thumbMob) {
            this.thumbMob.src = `${CONFIG.PRODUCT.basePath}image-product-${this.currentImg}.jpg`;
        }
    }
}

/**
 * Quantity selector management class
 */
class QuantitySelector {
    constructor() {
        this.amount = 0;
        this.plusBtn = DOMUtils.$(CONFIG.SELECTORS.plusBtn);
        this.minusBtn = DOMUtils.$(CONFIG.SELECTORS.minusBtn);
        this.amountDisplay = DOMUtils.$(CONFIG.SELECTORS.amount);
        
        this.init();
    }
    
    init() {
        this.updateDisplay();
        this.plusBtn?.addEventListener("click", () => this.increment());
        this.minusBtn?.addEventListener("click", () => this.decrement());
    }
    
    increment() {
        this.amount++;
        this.updateDisplay();
    }
    
    decrement() {
        if (this.amount > 0) {
            this.amount--;
            this.updateDisplay();
        }
    }
    
    updateDisplay() {
        if (this.amountDisplay) {
            this.amountDisplay.textContent = this.amount;
        }
    }
    
    getValue() {
        return this.amount;
    }
    
    reset() {
        this.amount = 0;
        this.updateDisplay();
    }
}

/**
 * Shopping cart management class
 */
class ShoppingCart {
    constructor(quantitySelector) {
        this.quantitySelector = quantitySelector;
        this.cartBtn = DOMUtils.$(CONFIG.SELECTORS.cartBtn);
        this.cart = DOMUtils.$(CONFIG.SELECTORS.cart);
        this.cartContent = DOMUtils.$(CONFIG.SELECTORS.cartContent);
        this.addBtn = DOMUtils.$(CONFIG.SELECTORS.addBtn);
        this.indicator = DOMUtils.$(CONFIG.SELECTORS.indicator);
        
        this.init();
    }
    
    init() {
        DOMUtils.hide(this.indicator);
        this.cartBtn?.addEventListener("click", () => this.toggle());
        this.addBtn?.addEventListener("click", () => this.addItem());
    }
    
    toggle() {
        DOMUtils.toggleClass(this.cart, "invisible");
    }
    
    addItem() {
        const quantity = this.quantitySelector.getValue();
        if (quantity > 0) {
            this.renderCartItem(quantity);
            this.updateIndicator(quantity);
        }
    }
    
    renderCartItem(quantity) {
        const total = CONFIG.PRODUCT.price * quantity;
        const cartHTML = `
            <div class="product">
                <div>
                    <img src="${CONFIG.PRODUCT.basePath}image-product-1-thumbnail.jpg" 
                         class="product-img" alt="product">
                    <div class="product-info">
                        <p class="product-title">${CONFIG.PRODUCT.name}</p>
                        <p>
                            <span>$${CONFIG.PRODUCT.price.toFixed(2)}</span> × 
                            <span class="number">${quantity}</span> 
                            <b>$${total.toFixed(2)}</b>
                        </p>
                    </div>
                    <button class="delete-btn" data-action="delete">
                        <img src="${CONFIG.PRODUCT.basePath}icon-delete.svg" alt="delete">
                    </button>
                </div>
                <button class="checkout-btn">Checkout</button>
            </div>
        `;
        
        if (this.cartContent) {
            DOMUtils.removeClass(this.cartContent, "empty");
            this.cartContent.innerHTML = cartHTML;
            
            // Add delete button event listener
            const deleteBtn = this.cartContent.querySelector(".delete-btn");
            deleteBtn?.addEventListener("click", () => this.deleteItem());
        }
    }
    
    deleteItem() {
        if (this.cartContent) {
            DOMUtils.addClass(this.cartContent, "empty");
            this.cartContent.innerHTML = "<p>Your cart is empty</p>";
            DOMUtils.hide(this.indicator);
        }
    }
    
    updateIndicator(quantity) {
        if (this.indicator) {
            this.indicator.textContent = quantity;
            DOMUtils.show(this.indicator);
        }
    }
}

/**
 * Lightbox management class
 */
class Lightbox {
    constructor() {
        this.lightbox = DOMUtils.$(CONFIG.SELECTORS.lightbox);
        this.closeLightboxBtn = DOMUtils.$(CONFIG.SELECTORS.closeLightboxBtn);
        this.mainThumbnail = DOMUtils.$(CONFIG.SELECTORS.mainThumbnail);
        
        this.init();
    }
    
    init() {
        this.closeLightboxBtn?.addEventListener("click", () => this.close());
        this.mainThumbnail?.addEventListener("click", () => this.open());
        
        // Close on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") this.close();
        });
        
        // Close on background click
        this.lightbox?.addEventListener("click", (e) => {
            if (e.target === this.lightbox) this.close();
        });
    }
    
    open() {
        DOMUtils.removeClass(this.lightbox, "invisible");
        document.body.style.overflow = "hidden"; // Prevent scrolling
    }
    
    close() {
        DOMUtils.addClass(this.lightbox, "invisible");
        document.body.style.overflow = ""; // Restore scrolling
    }
}

/**
 * Main application class that orchestrates all components
 */
class EcommerceApp {
    constructor() {
        this.quantitySelector = new QuantitySelector();
        this.menuManager = new MenuManager();
        this.imageGallery = new ImageGallery();
        this.shoppingCart = new ShoppingCart(this.quantitySelector);
        this.lightbox = new Lightbox();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    new EcommerceApp();
});