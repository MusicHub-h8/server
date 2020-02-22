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
    },
    {
      name: "Metal",
      total: 0
    },
    {
      name: "Pop",
      total: 0
    },
    {
      name: "Beats",
      total: 0
    },
    {
      name: "EDM",
      total: 0
    }
  ];
  // extract genres from all top artist
  let fetchGenres = [];
  result.items.forEach(artist => {
    artist.genres.forEach(genre => {
      fetchGenres.push(genre);
    });
  });
  console.log(fetchGenres);
  allGenres.forEach(genreItem => {
    let mainGenre = genreItem.name.toLowerCase();
    fetchGenres.forEach(genreName => {
      if (genreName.includes(mainGenre)) {
        genreItem.total += 1;
      }
    });
  });

  console.log(allGenres.sort((a, b) => a.total > b.total));
  console.log(allGenres[allGenres.length - 1].name);
  return allGenres[allGenres.length - 1].name;
};
