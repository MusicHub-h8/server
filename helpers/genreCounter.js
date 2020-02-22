module.exports = function genreCounter(result) {
  let allGenres = [
    {
      name: "Blues",
      total: 0
    },
    {
      name: "Classical",
      total: 0
    },
    {
      name: "Country",
      total: 0
    },
    {
      name: "Electronic",
      total: 0
    },
    {
      name: "Folk",
      total: 0
    },
    {
      name: "Hip-hop",
      total: 0
    },
    {
      name: "Jazz",
      total: 0
    },
    {
      name: "New age",
      total: 0
    },
    {
      name: "Reggae",
      total: 0
    },
    {
      name: "Rock",
      total: 0
    }
  ];

  let allGenres = [];
  result.items.forEach(item => {
    item.genres.forEach(genre => {
      allGenres.push(genre);
    });
  });
  let singleGenre = [];
  allGenres.forEach(genre => {
    genre.split(" ");
  });

  return allGenres;
};
