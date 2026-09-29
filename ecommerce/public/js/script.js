// Simple JS for confirmation
document.addEventListener('DOMContentLoaded', function() {
    const addToCartLinks = document.querySelectorAll('a[href*="add_to_cart"]');
    addToCartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (!confirm('Add this item to cart?')) {
                e.preventDefault();
            }
        });
    });
});