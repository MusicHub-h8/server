module.exports = function genreCounter(result) {
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
  console.log(allGenres);
  return allGenres;
};
