import React from "react";

export function HomeGallery() {
  const data = [
    {
      imgelink:
        "https://static.vecteezy.com/system/resources/previews/005/412/133/non_2x/big-sale-up-to-10-percent-off-all-sale-styles-in-stores-and-online-special-offer-sale-10-percent-number-tag-voucher-illustration-free-vector.jpg",
    },
    {
      imgelink:
        "https://www.creativefabrica.com/wp-content/uploads/2022/03/04/Fashion-logo-fashion-clothes-shop-Graphics-26436548-1-580x386.png",
    },
    {
      imgelink:
        "https://www.pngarts.com/files/1/Fashion-PNG-High-Quality-Image.png",
    },
    {
      imgelink:
        "https://cdn.discordapp.com/attachments/1078603218306732053/1289825951953453077/1496260.png?ex=66fa3b86&is=66f8ea06&hm=973851ae8534de1ff14bca4390d5598239b9c80f0443d655bd33901571f90f84&",
    },
    {
      imgelink:
        "https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/TOEwt0C/sale-animation-with-red-tags-for-shopping-sales-and-promotions_enxbfjtrl_thumbnail-1080_01.png",
    },
  ];

  const [active, setActive] = React.useState(
    "https://cdn.dribbble.com/users/2322685/screenshots/6221645/welcome-dribbble.gif"
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem 0",
      }}
    >
      {/* Main Image Header */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        <img
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "60%", // Reduce width for smaller display
            maxWidth: "1000px",
            height: "auto",
            maxHeight: "350px", // Adjust max height for proportion
            borderRadius: "1rem",
            objectFit: "contain", // Keep full image visible
            objectPosition: "center",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
          }}
          src={active}
          alt="Active Display"
        />
      </div>

      {/* Thumbnail Gallery */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "1rem 0",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        {data.map(({ imgelink }, index) => (
          <img
            key={index}
            onClick={() => setActive(imgelink)}
            src={imgelink}
            style={{
              height: "80px",
              width: "150px",
              cursor: "pointer",
              borderRadius: "0.5rem",
              objectFit: "cover",
              objectPosition: "center",
              transition: "transform 0.3s ease",
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
              border: active === imgelink ? "3px solid #4A90E2" : "none", // Highlight active image
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            alt="Gallery Thumbnail"
          />
        ))}
      </div>

      {/* Text Header for Shopping Items */}
      <h2
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          margin: "1.5rem 0",
          textAlign: "center",
        }}
      >
        Explore Our Latest Collections
      </h2>
    </div>
  );
}
