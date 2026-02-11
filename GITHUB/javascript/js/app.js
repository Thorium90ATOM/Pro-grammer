// Dette er et enkelt JavaScript-prosjekt//
// skriv ut ein tekst på skjermen//
document.write("Hello Mario!");
// vis eimn varselboks//
// alert("Hello world!")//

var alder = prompt("your age");
var utregning = alder * 8765.81277;
document.write("<br>you have lived for " + utregning + "hours");
/*ein heilt enkel utregning
var alder=prompt("din alder");
var utregning=alder*8765.81277;
 document.write("du har levd i " + utregning + " timer");
*/

//1.write out the width of the window//
document.write("<br>the width of your screen is " + window.innerWidth + " pixels");
//2.write out the height of the window//
document.write("<br>the height of your screen is " + window.innerHeight + " pixels");
//3. wrtite out the adress of the website your on//
document.write("<br>the adress of this website is " + window.location.href);
//5. log messages to the console//
console.log("this is a log message");
console.error("this is an error message");
console.warn("this is a warning message");
//6. make a button that makes particles appear on the screen when clicked//
function createParticles() {
    var particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * window.innerWidth + "px";
    particle.style.animationDuration = (Math.random() * 3 + 2) + "s";
    document.body.appendChild(particle);
}
// make particles dispear on a separate button click//
function clearParticles() {
    var particles = document.getElementsByClassName("particle");    
    while (particles[0]) {
        particles[0].parentNode.removeChild(particles[0]);
    }
}
// expose functions for inline HTML `onclick` handlers
if (typeof window !== 'undefined') {
    window.makeParticles = createParticles;
    window.clearParticles = clearParticles;
}

// variabler 
var personnavn = "Mario"; //string
var alder = 30; //integer
var erdekome = true; //boolean
var PI = 3.14159; //float
var b = "nils"; //string + dårleg navnevalg

//hvordan endre en variabel
personnavn = "Luigi";
alder = 28 * 2;
erdekome = false;
PI = 3.14;
b = "ben e ein dritsekk"; //string



