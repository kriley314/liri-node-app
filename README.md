# liri-node-app

THis project creates a command line interface to allow the user to issue command line statments to retrieve useful information!!
The specific information retrieved by this app includes concert information for a specified artist, information and a preview
for a specified song, and movie information for a specified movie.

This is a command line application and is used as follows:

  node liri concert-this <artist>
  node liri spotify-this-song <song name>
  node liri movie-this <movie name>
  node liri do-what-it-says

  The concert-this option allows you to get current concert information for the specified artist.  An example of this in use would be:

    node liri concert-this Elton John

  The spotify-this-song option allows you to get information for the specified song.  This information includes the artist name, the
  album name the song is on, and a link to allow you to preview the song.  An example of this in use would be:

    node liri spotify-this-song Disciplined Breakdown

  The movie-this option allow you to get information for the specified movie.  This information includes the year the movie was released,
  the movie's IMDB and Rotten Tomatoes ratings, the country th movie was filmed in, the language the movie is in, and the leading actors
  in the movie.  An example of this in use would be:

    node liri movie-this Silverado

  The do-what-it-says option allows the user to issue their command to liri through test in a file.  If no file name is specified, the
  application looks for the file, random.txt.  The contents of this file can specify conna separated values to call the about liri
  commands.  The default use of this command is:

    node liri do-what-it-says

  This will attempt to find the file, "random.txt" and process the liri command in the comma separated file.  Alternatively, the user
  can use other file names with the command:

    node liri do-what-it-says random2.txt

  This application is built using information from BandsInTown, Spotify, and omdb.

  