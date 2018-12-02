export default [
  "de",
  {
    od: {
      core: {},
      auth: {
        login: "Login",
        signup: "Account erstellen",
        logout: "Logout",
        noaccount: "Noch keinen Account? Hier klicken.",
        resetpassword: "Passwort vergessen? Hier klicken.",
        button: {
          login: "Einloggen",
          signup: "Erstellen"
        }
      },
      header: {
        dashboards: {
          header: "Dashboards",
          manage: "Dashboards verwalten",
          edit_mode_button: "Edit Mode",
          create: "Neues Dashboard erstellen",
          create_prompt:
            "Bitte Namen für neues Dashboard angeben und auf erstellen klicken.",
          delete: "Aktuelles Dashboard löschen",
          delete_prompt:
            "Sind Sie sicher, dass das aktuelle Dashboard gelöscht werden soll?",
          active: "aktiv",
          shared: "geteilt"
        },
        widgets: {
          header: "Widgets",
          presets: "Hinzufügen aus Vorlage",
          eud: "Neues Analyse-Widget erstellen"
        },
        user: {
          greeting: "Hallo,",
          profile_alt: "Nutzer Profilbild"
        }
      },
      dashboard: {
        empty: {
          message: "Keine Widgets gefunden :(",
          action: "Widget aus Vorlage hinzufügen"
        },
        shared: {
          message:
            "Du bearbeitest ein geteiltes Dashboard. Du kannst eine private Kopie anlegen.",
          action: "Private Kopie anlegen",
          who: "Mit wem wird geteilt?"
        },
        widgets: {
          add: "Widget aus Vorlage hinzufügen",
          rename: "Geben Sie dem Widget einen neuen Namen:",
          remove: "Wollen Sie das Widget wirklich löschen?",
          configurate: "Konfigurieren",
          noconfig: "Dieses Widget muss konfiguriert werden.",
          nodata: "Es stehen keine Daten zur Verfügung.",
          save: "Speichern",
          abort: "Abbrechen"
        },
        errors: {
          init:
            "Dashboard konnte nicht geladen werden. Bitte den Support kontaktieren.",
          create: "Dashboard konnte nicht erstellt werden.",
          change: "Dashboard konnte nicht gewechselt werden.",
          delete: "Dashboard konnte nicht gelöscht werden."
        }
      },
      presets: {
        add: "Hinzufügen"
      },
      select: {
        start: "Startdatum:",
        end: "Enddatum:",
        since: "Seit:",
        item: {
          label: "Sensoren auswählen",
          empty: "Keine Sensoren gefunden.",
          search: "Nach Sensoren suchen..."
        },
        icon: {
          label: "Icon auswählen",
          placeholder: "Es wurde noch kein Icon gewählt."
        },
        location: {
          label: "Standort auswählen",
          empty: "Keine Standorte gefunden.",
          search: "Nach Standorten suchen...",
          min: "Es muss mindestens ein Standort ausgewählt werden."
        }
      },
      ui: {
        ok: "OK",
        cancel: "Abbrechen",
        prev: "Zurück",
        next: "Weiter",
        notimplemented: "Diese Operation wird nicht unterstützt."
      }
    }
  }
];
