charger = JSON.parse(charger);

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: charger.geometry.coordinates,
    zoom: 9,
});
map.addControl(new mapboxgl.NavigationControl())



const marker = new mapboxgl.Marker()
    .setLngLat(charger.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h6>${charger.title}</h6>
                <p>${charger.location}</p>`
            )
    )
    .addTo(map);