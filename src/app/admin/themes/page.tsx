"use client";
import React, { useState } from "react";
import styles from "./page.module.scss";
import { createThemeAction } from "@/actions/themes/create";
import { readThemesAction } from "@/actions/themes/read";
import Form from "@/app/_components/Form/Form";
import TextInput from "@/app/_components/UI/TextInput";
import ColorInput from "@/app/_components/UI/ColorInput";
import { Themes } from "@/services/themes";

const mockThemes = [
  { id: 1, name: "Light Theme", primaryLight: "#FFFFFF", primaryDark: "#FFFFFF", secondaryLight: "#000000", secondaryDark: "#000000" },
  { id: 2, name: "Dark Theme", primaryLight: "#000000", primaryDark: "#000000", secondaryLight: "#FFFFFF", secondaryDark: "#FFFFFF" },
  { id: 3, name: "Custom Theme", primaryLight: "#FF91A4", primaryDark: "#FF91A4", secondaryLight: "#83C760", secondaryDark: "#83C760" },
];

export default function ThemesAdmin() {
  const [themes, setThemes] = useState((mockThemes))

  return (
    <div>
      <h1>Themes Admin</h1>
      <Form 
        action={createThemeAction.bind(null, {})}
        submitText="Lag nytt tema"
      >
        <TextInput name="name" label="Navn" />
        <ColorInput name="primaryLight" label="Primærfarge lys" />
        <ColorInput name="primaryDark" label="Primærfarge mørk" />
        <ColorInput name="secondaryLight" label="Sekundærfarge lys" />
        <ColorInput name="secondaryDark" label="Sekundærfarge mørk" />
      </Form>

      <ul>
        {themes.map((theme) => (
          <li
            key={theme.id}
            className={styles.themeList}
            style={{
              '--primaryLight': theme.primaryLight,
              '--primaryDark': theme.primaryDark,
              '--secondaryLight': theme.secondaryLight,
              '--secondaryDark': theme.secondaryDark,
            } as React.CSSProperties}
          >
            <span>{theme.name}</span>
            <div className={styles.buttonGroup}>
              <button className={`${styles.button} ${styles.editButton}`} onClick={() => handleEditTheme(theme.id)}>Edit</button>
              <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => setThemes(themes.filter((t) => t.id !== theme.id))}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
