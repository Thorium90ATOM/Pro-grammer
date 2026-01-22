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
//4.this code switches the text in the h1 element with alo//
document.getElementById("top").innerHTML = "alo";
//5. log messages to the console//
console.log("this is a log message");
console.error("this is an error message");
console.warn("this is a warning message");
//6. make a button that makes particles appear on the screen when clicked//
function makeParticles() {
    for (var i = 0; i < 100; i++) {
        var particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = Math.random() * window.innerWidth + "px";
        particle.style.top = Math.random() * window.innerHeight + "px";
        document.body.appendChild(particle);
    }
}
// make particles dispear on a separate button click//
function clearParticles() {
    var particles = document.getElementsByClassName("particle");
    while (particles[0]) {
        particles[0].parentNode.removeChild(particles[0]);
    }
}