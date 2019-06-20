export default [
  "de",
  {
    ow: {
      reporting: {
        createScheduled: "Neuen regelmäßigen Bericht erstellen"
      }
    },
    od: {
      core: {},
      auth: {
        login: "Login",
        login_fail: "Nutzername oder Passwort falsch",
        signup: "Account erstellen",
        logout: "Logout",
        pw:"Passwort zurücksetzen",
        noaccount: "Noch keinen Account? Hier klicken.",
        hasaccount: "Sie haben bereits einen Account? Hier klicken.",
        resetpassword: "Passwort vergessen? Hier klicken.",
        signup_success: "Account erfolgreich erstellt. Sie werden in 5 Sekunden weitergeleitet.",
        signup_fail: "Account konnte nicht angelegt werden.",
        reset_pw: "Sie erhalten in Kürze eine E-Mail mit weiteren Instruktionen.",
        input: {
          email: "Email",
          password: "Passwort",
          password_repeat: "Passwort wiederholen",
          password_missmatch:
            "Die angegebenen Passwörter stimmen nicht überein.",
          location_city:"Stadtname",
          location_lat: "GPS Latitude",
          location_long: "GPS Longitude"
        },
        button: {
          login: "Einloggen",
          signup: "Erstellen",
          resetpw: "Zurücksetzen"
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
          shared: "geteilt",
          edit: "Aktuelles Dashboard freigeben"
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
      user: {
        settings: {
          account: {
            header: "Account Einstellungen",
            action: "Account Einstellungen",
            password: {
              header: "Passwort ändern",
              password: "Neues Passwort",
              password_repeat: "Passwort wiederholen",
              password_missmatch:
                "Die angegebenen Passwörter stimmen nicht überein.",
              success: "Passwort wurde überschrieben",
              error: "Passwort konnte nicht übernommen werden"
            }
          },
          data: {
            header: "Benutzerdefinierte Namen für Sensoren",
            action: "Sensoren anpassen",
            col_default: "Standart Name",
            col_custom: "Benutzerdefinierter Name",
            click_to_edit: "Anklicken zum Editieren",
            success: "Namen wurden gespeichert.",
            error: "Namen konnten nicht gespeichert werden."
          },
          languages: {
            action: "Sprache ändern",
            info:
              "Bitte wählen Sie Ihre bevorzugte Sprache aus. Die Auswahl wird auf dem Gerät gespeichert und bei nachfolgenden Sitzungen bevorzugt."
          }
        }
      },
      dashboard: {
        empty: {
          message: "Keine Widgets gefunden :(",
          action: "Widget aus Vorlage hinzufügen"
        },
        shared: {
          invite: "Einen Nutzer zum Dashboard einladen",
          invite_success: "Der Nutzer wurde für das Dashboard freigegeben",
          invite_error:
            "Der Nutzer konnte nicht für das Dashboard freigegeben werden",
          invite_info:
            "Das Dashboard wird für den Nutzer freigegeben, dieser kann das Dashboard sehen und bearbeiten.",
          message:
            "Du bearbeitest ein geteiltes Dashboard. Du kannst eine private Kopie anlegen.",
          action: "Private Kopie anlegen",
          who: "Mit wem wird geteilt?"
        },
        widgets: {
          add: "Widget aus Vorlage hinzufügen",
          rename: "Geben Sie dem Widget einen neuen Namen:",
          remove:
            "Wollen Sie das Widget wirklich aus Ihrem Dashboard entfernen?",
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
          label: "Anlage auswählen",
          empty: "Keine Anlage gefunden.",
          search: "Nach Anlagen suchen...",
          min: "Es muss mindestens eine Anlage ausgewählt werden."
        }
      },
      ui: {
        ok: "OK",
        save: "Speichern",
        delete: "Löschen",
        cancel: "Abbrechen",
        prev: "Zurück",
        next: "Weiter",
        notimplemented: "Diese Operation wird nicht unterstützt."
      }
    },
    languages: {
      "en.label": "Englisch",
      "de.label": "Deutsch"
    }
  }
];
