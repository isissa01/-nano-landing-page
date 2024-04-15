// Selects various elements from the DOM to manipulate or interact with
const pageHeader = document.querySelector(".page__header")
const pageNav = document.querySelector(".page__nav");
const mainEl = document.querySelector(".page__main");
const modal = document.querySelector(".modal-container");
const container = document.querySelector(".container");
let isHovering = false;
let isScrolling = false;


// Creates a navigation list and a button for scrolling to the top of the page
const navList = document.createElement("ul");
navList.className = "nav-list";
const goToTopButton = document.createElement("button");
goToTopButton.textContent= "Go to Top";
goToTopButton.className = "to-top-btn"
container.insertAdjacentElement("afterend", goToTopButton)

// Retrieves all section elements within the main content area
function getSections(){
    return  document.querySelectorAll(".page__main section");
}

// Populates the navigation list based on sections available in the main content area
function createNavList(){
    
    const fragment = document.createDocumentFragment();
    hideHeader() // Temporarily hides the navigation during setup
    pageNav.innerHTML = ""; // Clears existing navigation items
    navList.innerHTML = "";
    getSections().forEach(section =>{
        const id = section.id;
        const text = section.dataset.nav;
        const listItem = document.createElement("li");
        listItem.className = "nav-list-item";
        
        const linkTag = document.createElement("a");
        linkTag.setAttribute("href", `#${id}`);
        linkTag.textContent = text;
        listItem.appendChild(linkTag);
        navList.appendChild(listItem);
        fragment.appendChild(navList)
    })
    showHeader(); // Re-displays the navigation with new items
    pageNav.appendChild(fragment);
    // pageNav.appendChild(navList)
    
}
createNavList();

// Adds click event listener to navigation list for smooth scrolling
navList.addEventListener("click", scroll);

// Handles the smooth scrolling to sections when navigation items are clicked
function scroll(event){
    event.preventDefault();
    isScrolling = true;
    const target = event.target;
    if(target.tagName =="A"){
        document.removeEventListener("scroll", makeActive);
        getSections().forEach(section => section.classList.remove("your-active-class"))
        for (item of navList.children){
            item.classList.remove("active");
        }
        const id = "#" + target.href.split("#")[1];
        const section = document.querySelector(id);
    
        section.classList.toggle('your-active-class');
        section.scrollIntoView({
            behavior: "smooth",
        });
        target.parentElement.classList.add("active");

        
    }
}

// Dynamically updates the active class on sections and navigation items based on scroll position
function makeActive(){
    isScrolling = true;
    setTimeout(() => {isScrolling = false;}, 500);

    showHeader();
    addBackToTopButton();
    getSections().forEach(section =>{
       const boundingBox =  section.getBoundingClientRect();
       if (boundingBox.top < 100  && boundingBox.bottom > boundingBox.height /4){
            if(!section.className.includes('your-active-class')){
                section.classList.add('your-active-class');
            }
            for (const item of navList.children){
                item.classList.remove("active");
            }
            const activeNav = getNavItem(section.id);
            activeNav.classList.add("active");
       }
       else{
        section.classList.remove('your-active-class');
       }
    })
}
document.addEventListener("scroll", makeActive);

// Retrieves the navigation item corresponding to a given section ID
function getNavItem(id){
    for(const item of navList.children){
         if(item.children[0].href.split("#")[1]  === id){
            return item;
         }
    }
}



// Adds a new section to the main content area and updates the navigation list
const newSection = document.createElement("section");
newSection.id="section4";
newSection.dataset["nav"] = "Section 4";
newSection.innerHTML = ` <div class="landing__container">
<h2>Section 4</h2>
<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi fermentum metus faucibus lectus pharetra dapibus. Suspendisse potenti. Aenean aliquam elementum mi, ac euismod augue. Donec eget lacinia ex. Phasellus imperdiet porta orci eget mollis. Sed convallis sollicitudin mauris ac tincidunt. Donec bibendum, nulla eget bibendum consectetur, sem nisi aliquam leo, ut pulvinar quam nunc eu augue. Pellentesque maximus imperdiet elit a pharetra. Duis lectus mi, aliquam in mi quis, aliquam porttitor lacus. Morbi a tincidunt felis. Sed leo nunc, pharetra et elementum non, faucibus vitae elit. Integer nec libero venenatis libero ultricies molestie semper in tellus. Sed congue et odio sed euismod.</p>

<p>Aliquam a convallis justo. Vivamus venenatis, erat eget pulvinar gravida, ipsum lacus aliquet velit, vel luctus diam ipsum a diam. Cras eu tincidunt arcu, vitae rhoncus purus. Vestibulum fermentum consectetur porttitor. Suspendisse imperdiet porttitor tortor, eget elementum tortor mollis non.</p>
</div>`

// Section creation and appending omitted for brevity
mainEl.appendChild(newSection)
createNavList()

// Handles the "Go to Top" button's click event for smooth scrolling to the top of the page
goToTopButton.addEventListener("click",  (evt) =>{
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
});
// Initially hides the "Go to Top" button
goToTopButton.classList.add("hidden");



// Shows or hides the "Go to Top" button based on scroll position
function addBackToTopButton(){
    const rect = container.getBoundingClientRect();
    if(window.innerHeight/2 + rect.top < 0 ){
        goToTopButton.classList.remove("hidden");
    } 
    else{
        goToTopButton.classList.add("hidden");
    }
}

// Opens a modal for adding a new section to the page
// Opens a modal for adding a new section to the page
function openAddSection(){
    
    pageHeader.classList.add("hidden");
    document.removeEventListener("scroll", makeActive);
    modal.style.visibility = "visible";
    modal.style.opacity = "1";
}

// Creates a new section based on user input from the modal
function createSection(event){
    const start = performance.now();
    event.preventDefault();
    const formData = new FormData(event.target);
    const sectionName = formData.get("sectionName");
    const sectionContent = formData.get("sectionContent").split("\n");
    const content = sectionContent.map((item) =>  (item !== "") ? `<p>${item}</p>` : null)

    const idNumber = parseInt(navList.lastChild.children[0].href.split("#")[1].split("section")[1]) + 1
    const newSection = document.createElement("section");
    newSection.id="section" + idNumber;
    newSection.dataset["nav"] = sectionName || "Section " + idNumber;
    newSection.innerHTML = ` <div class="landing__container">
    <h2>${sectionName}</h2>${content.join("") }</div>`;

    mainEl.appendChild(newSection);
    createNavList()
    event.target.reset();
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    document.addEventListener("scroll", makeActive);
    pageHeader.classList.remove("hidden");

    console.log("Performance: " , performance.now() - start);
}

// Closes the modal and re-enables dynamic section highlighting
const closeModal = document.querySelector(".close-modal");
closeModal.addEventListener("click", () =>{
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    pageHeader.classList.remove("hidden");
    document.addEventListener("scroll", makeActive);
})

function hideHeader(){
    if(!isHovering  && !pageHeader.classList.contains("hidden")){pageHeader.classList.add("hidden")}

}
function showHeader(){
    pageHeader.classList.remove("hidden");
}

// Hides the page header after a delay when scrolling stops
// Hides the page header after a delay when scrolling stops
document.addEventListener("scrollend", (e) =>{
    if(isScrolling){
        isScrolling = false;
        document.addEventListener("scroll", makeActive);
    }
    
    setTimeout(hideHeader, 1500);
});
// Ensures the page header is shown when hovered over
pageHeader.addEventListener("mouseover", showHeader);



pageHeader.addEventListener("mouseover", function() {
    isHovering = true; // Update flag to true when mouse enters
    showHeader();
});

// Updates the isHovering flag when the mouse leaves the header
pageHeader.addEventListener("mouseout", function() {
    isHovering = false; 
});
