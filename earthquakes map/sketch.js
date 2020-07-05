let mapImage;
let earthQuakesData;
let centerLat = 0;
let centerLong = 0;
let zoomLevel = 1;
// Bhutan : 27.5142° N, 90.4336° E
let lat = 27.5142;
let long = 90.4336;
function preload() {
    mapImage = loadImage(
        `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/${centerLat},${centerLong},${zoomLevel},0,0/1024x512?access_token=pk.eyJ1IjoiamlnbWUiLCJhIjoiY2tjOTM5a3EzMWhkMjJ5bWc0ZjRrazA4NyJ9.7gVQ-PWLYFWm7RSNcqj0gg`
    );
    earthQuakesData = loadStrings(
        'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv'
    );
}

function changedLong(long) {
    long = radians(long);
    let a = (256 / PI) * pow(2, zoomLevel);
    let b = (long + PI);
    return a * b;
}

function changedLat(lat) {
    lat = radians(lat);
    let a = (256 / PI) * pow(2, zoomLevel);
    let b = tan(PI / 4 + lat / 2);
    let c = PI - log(b);
    return a * c;
}

function setup() {
    createCanvas(1024, 512);
    translate(width / 2, height / 2);
    imageMode(CENTER);
    image(mapImage, 0, 0);

    let max = 0;
    for (let i = 0; i < earthQuakesData.length; i++) {
        let data = earthQuakesData[i].split(/,/);
        //console.log(data)
        let lat = data[1];
        let long = data[2];
        let mag = data[4];
        if (mag > max) {
            max = mag;
        }

        let cx = changedLong(centerLat);
        let cy = changedLat(centerLong);
        let y = changedLat(lat) - cy;
        let x = changedLong(long) - cx;
        mag = pow(10, mag);
        mag = sqrt(mag);
        let maxMag = sqrt(pow(10, 10));
        let d = map(mag, 0, maxMag, 0, 500);
        stroke(255, 0, 255);
        fill(255, 0, 200, 100);
        ellipse(x, y, d, d);
    }

    createP(
        'The maximum Magnitude of the EarthQuake that happened in the past 30 days is: ' +
        max
    )
        .style('font-size', '20pt')
        .style('margin', '3rem');

}