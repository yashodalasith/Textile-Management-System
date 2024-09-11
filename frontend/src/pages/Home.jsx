import { Button } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex justify-center">
      <div>Home</div>
      <div>
        <Link to="/cart">
          <Button>To cart</Button>
        </Link>
      </div>
    </div>
  );
}
