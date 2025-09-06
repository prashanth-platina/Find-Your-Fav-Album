import "./App.css";
import {FormControl,InputGroup,Container,Button,Card,Row} from "react-bootstrap";
import { useState, useEffect } from "react";

const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    let authParams = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
    };

    fetch("https://accounts.spotify.com/api/token", authParams)
      .then((result) => result.json())
      .then((data) => {
        setAccessToken(data.access_token);
      });
  }, []);

  async function search() {
    let artistParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };

    // Get Artist
    const artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    // Get Artist Albums
    await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums?include_groups=album&market=US&limit=50",
      artistParams
    )
      .then((result) => result.json())
      .then((data) => {
        setAlbums(data.items);
      });
  }

  return (
    <>
      <Container style={{ textAlign: "center", marginTop: "20px" }}>
        <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>
    Search Your Album 🎶
  </h2>
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                search();
              }
            }}
            onChange={(event) => setSearchInput(event.target.value)}
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>

      <Container>
        <Row
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {albums.map((album) => {
            return (
              <Card
  key={album.id}
  style={{
    background: "linear-gradient(180deg, #282828, #121212)", // Spotify dark gradient
    color: "white",
    margin: "15px",
    borderRadius: "12px",
    marginBottom: "30px",
    width: "220px",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0px 4px 12px rgba(0,0,0,0.4)",
  }}
  className="album-card"
>
  <Card.Img
    variant="top"
    src={album.images[0]?.url}
    style={{
      borderTopLeftRadius: "12px",
      borderTopRightRadius: "12px",
      height: "220px",
      objectFit: "cover",
    }}
  />
  <Card.Body style={{ padding: "15px" }}>
    <Card.Title
      style={{
        fontWeight: "bold",
        fontSize: "16px",
        marginBottom: "10px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      {album.name}
    </Card.Title>
    <Card.Text style={{ fontSize: "14px", opacity: 0.8 }}>
      Release Date: {album.release_date}
    </Card.Text>
    <Button
      href={album.external_urls.spotify}
      target="_blank"
      style={{
        backgroundColor: "#1db954", // Spotify green
        color: "white",
        fontWeight: "bold",
        border: "none",
        borderRadius: "6px",
        padding: "8px 12px",
      }}
    >
      Open in Spotify
    </Button>
  </Card.Body>
</Card>

            );
          })}
        </Row>
      </Container>
    </>
  );
}

export default App;