const carousel = document.querySelector(".carousel");
const wrapper = document.querySelector(".wrapper");
const arrowBtns = document.querySelectorAll(".wrapper i");
const firstCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChildren = [...carousel.children];

let isDragging = false, startX, startScrollLeft, timeoutId;

// get the number of cards that can fit in the carousel
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Insert copies of the last few cards to begining of carousel for infinite scrolling
const insertCopiesToBegining = () => {
    if(carouselChildren.length < 3 && window.innerWidth > 600) return;
    carouselChildren.slice(-cardPerView).reverse().forEach(card => {
        carousel.insertAdjacentHTML("afterbegin", card.outerHTML)
    });
}
insertCopiesToBegining()

// Insert copies of the first few cards to end of carousel for infinite scrolling
const insertCopiesToLast = () => {
    if(carouselChildren.length < 3 && window.innerWidth > 600) return;
    carouselChildren.slice(0, cardPerView).forEach(card => {
        carousel.insertAdjacentHTML("beforeend", card.outerHTML)
    })
}
insertCopiesToLast()

// Add event listners to the arrow buttons to scroll the carousel left and right
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        // If clicked button is left, then substract first card width from the carousel scrollLeft else add to it.
        carousel.scrollLeft += btn.id === "left" ? -firstCardWidth : +firstCardWidth
    })
})

const dragStart = (e) => {
    isDragging = true
    carousel.classList.add('dragging')
    // Records the initial cursor and scroll position of the carousel
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
}

const dragging = (e) => {
    if (!isDragging) return; //if is dragging is false return here
    // Updates the scroll position of the carousel based on the cursor movement
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX)
}

const draggStop = () => {
    isDragging = false
    carousel.classList.remove('dragging')
}

const autoPlay = () => {
    if (window.innerWidth < 800) return // return if windo is smaller than 800 means no auto play in mobile devices
    timeoutId = setTimeout(() => carousel.scrollLeft += firstCardWidth, 2500)
}
// for autoplay
autoPlay()

const infiniteScroll = () => {
    // scrollLeft sets or returns the number of pixel an element's content is scrolled horizantally.
    if (carousel.scrollLeft === 0) {
        // console.log("You have reached to the left end");
        // if carousel is at the begining scroll to the end
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth = (2 * carousel.offsetWidth)
        carousel.classList.remove("no-transition");
    }
    else if (carousel.scrollLeft === carousel.scrollWidth - carousel.offsetWidth) {
        // console.log("You've reached to the right end")
        // if carousel is at the end scroll to the begining
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth
        carousel.classList.remove("no-transition");
    }

    // for autoplay
    // clear timout and start autoplay if mouse is not hovering over carousel.
    clearTimeout(timeoutId)
    if (!wrapper.matches(":hover")) autoPlay();

}

carousel.addEventListener("mousedown", dragStart)
carousel.addEventListener("mousemove", dragging)
document.addEventListener("mouseup", draggStop)
carousel.addEventListener("scroll", infiniteScroll)

// for autoplay
wrapper.addEventListener("mouseenter", () => clearTimeout(timeoutId))
wrapper.addEventListener("mouseleave", autoPlay)