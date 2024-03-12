const wrapper = document.querySelector(".wrapper");
const customCarousel = document.querySelector(".customCarousel");
const firstCardWidth = customCarousel.querySelector(".customCard").offsetWidth;
const arrowBtns = document.querySelectorAll(".wrapper i");
const carouselChildrens = [...customCarousel.children];

let isDragging = false, isAutoPlay = true, startX, startScrollLeft, timeoutId;

// Get the number of customCards that can fit in the customCarousel at once
let customCardPerView = Math.round(customCarousel.offsetWidth / firstCardWidth);

// Insert copies of the last few customCards to begining of customCarousel for infinite scrolling
const insertCopiesToBegining = () => {
    if (carouselChildrens.length < 3 && window.innerWidth > 600) return;
    carouselChildrens.slice(-customCardPerView).reverse().forEach(customCard => {
        customCarousel.insertAdjacentHTML("afterbegin", customCard.outerHTML)
    });
}
insertCopiesToBegining()

// Insert copies of the first few customCards to end of customCarousel for infinite scrolling
const insertCopiesToLast = () => {
    if (carouselChildrens.length < 3 && window.innerWidth > 600) return;
    carouselChildrens.slice(0, customCardPerView).forEach(customCard => {
        customCarousel.insertAdjacentHTML("beforeend", customCard.outerHTML)
    })
}
insertCopiesToLast()
// Scroll the customCarousel at appropriate postition to hide first few duplicate customCards on Firefox
customCarousel.classList.add("custom-no-transition");
customCarousel.scrollLeft = customCarousel.offsetWidth;
customCarousel.classList.remove("custom-no-transition");

// Add event listeners for the arrow buttons to scroll the customCarousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        customCarousel.scrollLeft += btn.id == "left" ? -firstCardWidth : firstCardWidth;
    });
});

const dragStart = (e) => {
    isDragging = true;
    customCarousel.classList.add("dragging");
    // Records the initial cursor and scroll position of the customCarousel
    startX = e.pageX;
    startScrollLeft = customCarousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return; // if isDragging is false return from here
    // Updates the scroll position of the customCarousel based on the cursor movement
    customCarousel.scrollLeft = startScrollLeft - (e.pageX - startX);
}

const dragStop = () => {
    isDragging = false;
    customCarousel.classList.remove("dragging");
}

const infiniteScroll = () => {
    // If the customCarousel is at the beginning, scroll to the end
    if (customCarousel.scrollLeft === 0) {
        customCarousel.classList.add("custom-no-transition");
        customCarousel.scrollLeft = customCarousel.scrollWidth - (2 * customCarousel.offsetWidth);
        customCarousel.classList.remove("custom-no-transition");
    }
    // If the customCarousel is at the end, scroll to the beginning
    else if (Math.ceil(customCarousel.scrollLeft) === customCarousel.scrollWidth - customCarousel.offsetWidth) {
        customCarousel.classList.add("custom-no-transition");
        customCarousel.scrollLeft = customCarousel.offsetWidth;
        customCarousel.classList.remove("custom-no-transition");
    }

    // Clear existing timeout & start autoplay if mouse is not hovering over customCarousel
    clearTimeout(timeoutId);
    if (!wrapper.matches(":hover")) autoPlay();
}

const autoPlay = () => {
    if (window.innerWidth < 800 || !isAutoPlay) return; // Return if window is smaller than 800 or isAutoPlay is false
    // Autoplay the customCarousel after every 2500 ms
    timeoutId = setTimeout(() => customCarousel.scrollLeft += firstCardWidth, 2500);
}
autoPlay();

customCarousel.addEventListener("mousedown", dragStart);
customCarousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
customCarousel.addEventListener("scroll", infiniteScroll);
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);