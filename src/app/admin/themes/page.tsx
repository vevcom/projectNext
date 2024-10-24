"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { updateThemeAction } from "@/actions/themes/update";
import { createThemeAction } from "@/actions/themes/create";


const mockThemes = [
  { id: 1, name: "Light Theme", primaryColor: "#FFFFFF", secondaryColor: "#000000" },
  { id: 2, name: "Dark Theme", primaryColor: "#000000", secondaryColor: "#FFFFFF" },
  { id: 3, name: "Custom Theme", primaryColor: "#FF91A4", secondaryColor: "#83C760" },
];

export default function ThemesAdmin() {
  const [themes, setThemes] = useState(mockThemes);
  const [newTheme, setNewTheme] = useState({ name: "", primaryLight: "", primaryDark: "", secondaryLight: "", secondaryDark: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateThemeAction
  };

  const handleCreateTheme = async () => {
    createThemeAction
  };

  return (
    <div>
      <h1>Themes Admin</h1>
      <ul>
        {themes.map((theme) => (
          <li
            key={theme.id}
            style={{ backgroundColor: theme.primaryColor, color: theme.secondaryColor, padding: "10px", margin: "10px 0" }}
          >
            <span>{theme.name}</span>
            <button>Edit</button>
            <button onClick={() => setThemes(themes.filter((t) => t.id !== theme.id))}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Create New Theme</h2>
      <div>
        <input
          type="text"
          name="name"
          placeholder="Theme Name"
          value={newTheme.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="primaryLight"
          placeholder="Primary Color Light (Hex)"
          value={newTheme.primaryLight}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="primaryDark"
          placeholder="Primary Color Dark (Hex)"
          value={newTheme.primaryDark}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="secondaryLight"
          placeholder="Secondary Color Light (Hex)"
          value={newTheme.secondaryLight}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="secondaryDark"
          placeholder="Secondary Color Dark (Hex)"
          value={newTheme.secondaryDark}
          onChange={handleInputChange}
        />
        <button onClick={handleCreateTheme}>Create New Theme</button>
      </div>
    </div>
  );
}
