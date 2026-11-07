import React from "react";
import { motion } from "framer-motion";

export default function HoldScreen({
  title,
  subtitle,
  icon,
}) {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "70vh",
        padding: "20px",
        maxWidth: "1200px",
        margin: "0 auto",
        textAlign: "left",
      }}
    >
      {/* Animated Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "24px",
          border: "1px solid #e5e5e5",
        }}
      >
        {icon}
      </motion.div>

      {/* Animated Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4"
        style={{ maxWidth: "600px" }}
      >
        <h2
          style={{
            color: "#b300ff",
            fontWeight: 700,
            letterSpacing: "0.5px",
            marginBottom: "12px",
          }}
        >
          {title}
        </h2>

        <p
          style={{
            color: "#1f2a44",
            fontSize: "18px",
            lineHeight: "1.5",
          }}
        >
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
}
