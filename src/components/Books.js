import React, { useState } from "react";
import {
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";
import axios from "axios";

import BookCard from "./BookCard";
const Books = (props) => {
  const [numberResults, setNumberResults] = useState(10);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);

  const handleSubmit = () => {
    setLoading(true);
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${numberResults}`
      )
      .then((res) => {
        if (res.data.items.length > 0) {
          const books = res.data.items;
          localStorage.setItem("books", books);
          setCards(books);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(true);
        console.log(err.response);
      });
  };
  const mainContainer = () => {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div style={{ width: "60%", paddingTop: 10 }}>
          <InputGroup size="lg" className="mb-3">
            <Input
              placeholder="Book Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <InputGroupAddon addonType="append">
              <Button color="secondary" onClick={handleSubmit}>
                Search
              </Button>
            </InputGroupAddon>
          </InputGroup>
          <div className="w-50">
            <FormGroup className="d-flex justify-content-center justify-content-between">
              <Label for="numberResults">Number Results</Label>
              <Input
                type="number"
                id="numberResults"
                placeholder="Number Results"
                value={numberResults}
                onChange={(e) => setNumberResults(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </div>
    );
  };

  const handleCards = () => {
    if (loading) {
      return (
        <div className="d-flex justify-content-center mt-3">
          <Spinner style={{ width: "3rem", height: "3rem" }} />
        </div>
      );
    } else {
      const items = cards.map((item, i) => {
        let thumbnail = "";
        if (item.volumeInfo.imageLinks) {
          thumbnail = item.volumeInfo.imageLinks.thumbnail;
          console.log(thumbnail);
        }

        return (
          <div className="col-lg-4 mb-3" key={item.id}>
            <BookCard
              thumbnail={thumbnail}
              title={item.volumeInfo.title}
              pageCount={item.volumeInfo.pageCount}
              language={item.volumeInfo.language}
              authors={item.volumeInfo.authors}
              publisher={item.volumeInfo.publisher}
              description={item.volumeInfo.description}
              previewLink={item.volumeInfo.previewLink}
              infoLink={item.volumeInfo.infoLink}
            />
          </div>
        );
      });
      return (
        <div className="container">
          <div className="row">{items}</div>
        </div>
      );
    }
  };
  return (
    <div className="w-100 h-100">
      {mainContainer()}
      {handleCards()}
    </div>
  );
};

export default Books;
