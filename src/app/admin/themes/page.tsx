"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { updateThemeAction } from "@/actions/themes/update";
import { createThemeAction } from "@/actions/themes/create";

const mockThemes = [
  { id: 1, name: "Light Theme", primaryLight: "#FFFFFF", primaryDark: "#FFFFFF", secondaryLight: "#000000", secondaryDark: "#000000" },
  { id: 2, name: "Dark Theme", primaryLight: "#000000", primaryDark: "#000000",  secondaryLight: "#FFFFFF", secondaryDark: "#FFFFFF" },
  { id: 3, name: "Custom Theme", primaryLight: "#FF91A4", primaryDark: "#FF91A4", secondaryLight: "#83C760", secondaryDark: "#83C760" },
];

export default function ThemesAdmin() {
  const [themes, setThemes] = useState(mockThemes);
  const [newTheme, setNewTheme] = useState({ name: "", primaryLight: "", primaryDark: "", secondaryLight: "", secondaryDark: "" });
  const [editingThemeId, setEditingThemeId] = useState<number | null>(null); // Track the theme being edited

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (editingThemeId) {
      const updatedThemes = themes.map((theme) =>
        theme.id === editingThemeId ? { ...theme, [name]: value } : theme
      );
      setThemes(updatedThemes);

      const formData = new FormData();
      formData.append(name, value);

      try {
        await updateThemeAction({ id: editingThemeId }, formData); // Pass both params and FormData
      } catch (error) {
        console.error("Error updating theme:", error);
        alert("Failed to update theme.");
      }
    } else {
      setNewTheme((prevTheme) => ({
        ...prevTheme,
        [name]: value,
      }));
    }
  };

  const handleCreateTheme = async () => {
    if (!newTheme.name || !newTheme.primaryLight || !newTheme.primaryDark || !newTheme.secondaryLight || !newTheme.secondaryDark) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", newTheme.name);
      formData.append("primaryLight", newTheme.primaryLight);
      formData.append("primaryDark", newTheme.primaryDark);
      formData.append("secondaryLight", newTheme.secondaryLight);
      formData.append("secondaryDark", newTheme.secondaryDark);

      const createdTheme = await createThemeAction({}, formData);

      if (createdTheme && 'id' in createdTheme && 'name' in createdTheme && 'primaryColor' in createdTheme && 'secondaryColor' in createdTheme) {
        const validTheme = createdTheme as { id: number; name: string; primaryColor: string; secondaryColor: string };
        setThemes([...themes, validTheme]);
        setNewTheme({ name: "", primaryLight: "", primaryDark: "", secondaryLight: "", secondaryDark: "" }); // Reset form
      } else {
        console.error("Failed to create theme:", createdTheme);
        alert("Error occurred while creating theme.");
      }
    } catch (error) {
      console.error("Error creating theme:", error);
      alert("Failed to create theme.");
    }
  };

  const handleEditTheme = (themeId: number) => {
    const themeToEdit = themes.find((theme) => theme.id === themeId);
    if (themeToEdit) {
      setNewTheme({
        name: themeToEdit.name,
        primaryLight: themeToEdit.primaryLight,
        primaryDark: themeToEdit.primaryDark,
        secondaryLight: themeToEdit.secondaryLight,
        secondaryDark: themeToEdit.secondaryDark,
      });
      setEditingThemeId(themeId);
    }
  };

  return (
    <div>
      <h1>Themes Admin</h1>
      
      <ul>
  {themes.map((theme) => (
    <li
      key={theme.id}
      className={styles.themeList}
      style={{
        '--primarylight-color': theme.primaryLight,      
        '--secondarylight-color': theme.secondaryLight,  
        '--primarydark-color': theme.primaryDark,      
        '--secondarydark-color': theme.secondaryDark 
      } as React.CSSProperties}
    >
      <span className={styles.themeName}>{theme.name}</span>
      <div className={styles.buttonGroup}>
        <button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEditTheme(theme.id)}>Edit</button>
        <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => setThemes(themes.filter((t) => t.id !== theme.id))}>Delete</button>
      </div>
    </li>
  ))}
</ul>



      <h2>{editingThemeId ? "Edit Theme" : "Create New Theme"}</h2>
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
        <button onClick={handleCreateTheme} disabled={editingThemeId !== null}>
          {editingThemeId ? "Update Theme" : "Create New Theme"}
        </button>
      </div>
    </div>
  );
}
