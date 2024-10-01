import React from "react";

const AboutUs = () => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        color: "#333",
        padding: "20px",
      }}
    >
      {/* Header Section */}
      <div
        style={{
          background:
            "linear-gradient(to bottom right, #0f0c29, #302b63, #24243e)",
          padding: "60px 20px",
          color: "white",
        }}
      >
        <h1 style={{ fontSize: "48px", fontWeight: "bold", margin: "0" }}>
          About Us
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: "18px" }}>
          Home {">"} About Us
        </p>
      </div>

      {/* What We Do Section */}
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#ff3d68", fontSize: "24px", fontWeight: "bold" }}>
          What We Do Best
        </h2>
        <h1 style={{ fontSize: "36px", margin: "10px 0", fontWeight: "bold" }}>
          We Offer Quality Products at Impressive Prices with Frequent Discounts
        </h1>
        <p
          style={{
            maxWidth: "800px",
            margin: "20px auto",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          Our mission is to bring the latest fashion trends to you at the best
          possible prices. From casual wear to office wear, we ensure that every
          piece in our collection is made with the finest materials and the
          highest attention to detail. We offer frequent discounts and
          promotions to make fashion accessible to everyone.
        </p>
      </div>

      {/* Image Section */}
      <div
        style={{ display: "flex", justifyContent: "center", margin: "40px 0" }}
      >
        <img
          src="https://www.careergirls.org/wp-content/uploads/2018/05/FashionDesigner_1920x1080.jpg"
          alt="Fashion Products"
          style={{
            width: "80%",
            height: "auto",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      {/* Why Work With Us Section */}
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "60px 20px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#ff3d68",
          }}
        >
          Why Shop With Us
        </h2>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", margin: "10px 0" }}>
          Over <span style={{ color: "#ff3d68" }}>500+</span> Successful Orders
          Completed
        </h1>
        <p
          style={{
            maxWidth: "700px",
            margin: "20px auto",
            fontSize: "18px",
            lineHeight: "1.6",
          }}
        >
          We’ve successfully delivered high-quality fashion items to hundreds of
          satisfied customers. Our commitment is to offer you the best value for
          your money with excellent customer service and a wide selection of
          trendy pieces.
        </p>
      </div>

      {/* Footer Section
      <div
        style={{
          background: "#24243e",
          color: "white",
          padding: "30px 20px",
          textAlign: "center",
        }}
      >
        <p style={{ margin: "0", fontSize: "16px" }}>
          © 2024 Fashion E-Commerce. All Rights Reserved.
        </p>
      </div> */}
    </div>
  );
};

export default AboutUs;
