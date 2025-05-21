const indianListings = [
  {
    title: "Serene Backwater Houseboat",
    description:
      "Float through the tranquil backwaters of Kerala on a traditional houseboat. A unique and peaceful experience awaits.",
    image: {
      filename: "listingimage",
      url: "https://www.treksandtrails.org/blog/wp-content/uploads/2023/03/Kerala-backwaters.jpg",
    },
    price: 1500,
    location: "Alleppey",
    country: "India",
    category: "Boats",
    geometry: {
      type: "Point",
      coordinates: [76.3375, 9.4981],
    },
  },
  {
    title: "Luxury Desert Camp",
    description:
      "Experience royal living in the golden sands of the Thar Desert. Enjoy camel rides, folk music, and stargazing in Jaisalmer.",
    image: {
      filename: "listingimage",
      url: "https://q-xx.bstatic.com/xdata/images/hotel/max500/413083536.jpg?k=6224f6e1cbbcbc1ed48a6585901684288a9055b5ef5a263f219c02237387dcf8&o=&s=1000x",
    },
    price: 2500,
    location: "Jaisalmer",
    country: "India",
    category: "Camping",
    geometry: {
      type: "Point",
      coordinates: [70.9083, 26.9157],
    },
  },
  {
    title: "Mountain Cabin in Himachal",
    description:
      "Escape to the cool mountains with this cozy wooden cabin surrounded by pine forests and snow-capped peaks.",
    image: {
      filename: "listingimage",
      url: "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTI5NjIxNTA3Mzk1Njc3NTE3Mw%3D%3D/original/04cf728d-b9aa-41bd-aee7-d09079c62fe3.jpeg",
    },
    price: 1200,
    location: "Manali",
    country: "India",
    category: "Mountain",
    geometry: {
      type: "Point",
      coordinates: [77.1887, 32.2432],
    },
  },
  {
    title: "Beachfront Shack in Goa",
    description:
      "Enjoy the laid-back vibes of Goa in this beachfront shack just steps from the waves and the vibrant nightlife.",
    image: {
      filename: "listingimage",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkPzSq3vm_ecATAepC-DC_Za9K8KkGvjUuOQ&s",
    },
    price: 1800,
    location: "Anjuna",
    country: "India",
    category: "Beach",
    geometry: {
      type: "Point",
      coordinates: [73.7432, 15.5872],
    },
  },
  {
    title: "Tea Estate Bungalow",
    description:
      "Stay in a colonial-era bungalow nestled in the hills of a lush tea plantation. Perfect for nature lovers and peace seekers.",
    image: {
      filename: "listingimage",
      url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTALFp1QiWPwN9ZRUlHfPI_8onJ8juKY9dIoA&s",
    },
    price: 2000,
    location: "Munnar",
    country: "India",
    category: "Farms",
    geometry: {
      type: "Point",
      coordinates: [77.0621, 10.0889],
    },
  },
  {
    title: "Lakeview Palace Stay",
    description:
      "Live like royalty in a palace hotel on the edge of Lake Pichola. Enjoy boat rides, heritage tours, and fine dining.",
    image: {
      filename: "listingimage",
      url: "https://r1imghtlak.mmtcdn.com/103f9c44c36711e994bf0242ac110003.jpg",
    },
    price: 3000,
    location: "Udaipur",
    country: "India",
    category: "Iconic cities",
    geometry: {
      type: "Point",
      coordinates: [73.6850, 24.5854],
    },
  },
];

module.exports = { indData: indianListings };