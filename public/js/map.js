document.addEventListener('DOMContentLoaded', function () {
    // Get the coordinates and data from the map element
    var lat = parseFloat(document.getElementById('map').getAttribute('data-lat'));
    var lng = parseFloat(document.getElementById('map').getAttribute('data-lng'));
  
    // Initialize the map
    var map = L.map('map').setView([lat, lng], 13); // 13 is the zoom level (can adjust)
  
    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
  
    // Add a marker at the listing's location
    L.marker([lat, lng]).addTo(map)
      .bindPopup("<b>" + document.getElementById('map').getAttribute('data-title') + "</b><br>" + document.getElementById('map').getAttribute('data-location'))
      .openPopup();
  });
  