export default [
  "de",
  {
    ow: {
      reporting: {
        createScheduled: "Neuen regelmäßigen Bericht erstellen",
        title: "Auswahl der Standorte für den Report:",
        report_standard_label1: "15 Minuten",
        report_standard_label2: "1 Stunde",
        report_standard_label3: "1 Tag",
        report_standard_label4: "7 Tage",
        report_standard_label5: "Sensoren",
        report_standard_label6: "Darstellung",
        report_standard_label7: "Zeitabschnitt",
        report_standard_label8: "Report Einstellungen",
        report_download_desc: "Mit deinem Klick auf das Icon wird der Bericht erstellt. Im Anschluss wird dieser automatisch heruntergeladen."
      }
    },
    od: {
      core: {},
      greis: {
        report_adhoc: "Neuen Bericht anlegen",
        report_modal_topic: "Neuen bericht für",
        report_modal_button_create: "Bericht anlegen",
        report_select_timespan: "Berichtszeitraum auswählen:",
        report_timed_info1: "Kein Bericht für",
        report_timed_info2: "geplant.",
        report_timed_info3: "Name des Berichts:",
        report_timed_info4: "Emfpänger:",
        report_timed_button: "Neuen regelmäßigen Bericht anlegen",
        report_timed_label1: "Name für den Bericht",
        report_timed_label2: "Interval festlegen",
        report_timed_label3: "Täglich einen Bericht erhalten (24-Stunden Bericht)",
        report_timed_label4: "Wöchentlich einen Bericht erhalten (7-Tage Bericht)",
        report_timed_label5: "Monatlich einen Bericht erhalten (Monats-Bericht)",
        report_timed_label6: "Jeden dritten Monat einen Bericht erhalten (Quartals-Bericht)",
        report_timed_label7: "Alle halbe Jahr einen Bericht erhalten (Halbjahres-Bericht)",
        report_timed_label8: "Jährlich einen Bericht erhalten (Jahres-Bericht)",
        report_timed_label9: "E-Mail Empfänger des Berichts",
        report_timed_label10: "Bericht anlegen",
        report_timed_label11: "Geplante Berichte verwalten für"
      },
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
          edit_mode_button: "Bearbeiten",
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
          language: {
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
        add: "Hinzufügen",
        title: "Vorlage zum Dashboard hinzufügen"
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
      },
      eud: {
        title_step1: "Wahl der Datenquelle",
        title_step2: "Wahl des Betrachtungszeitraums",
        title_step3: "Wahl der Daten-Darstellung",
        title_step4: "Einstellung zur Daten-Darstellung",
        title_step5: "Vorschau der Auswahl",
        step1_icon: "Items",
        step2_icon: "Zeitraum",
        step3_icon: "Graphen",
        step4_icon: "Einstellungen",
        step5_icon: "Vorschau",
        button_before: "ZURÜCK",
        button_next: "WEITER",
        button_save: "SPEICHERN",
        step2_info1: "Es werden die Daten der letzten",
        step2_info2: "angezeigt.",
        step2_info1a: "Das entspricht",
        step2_info2a: "Tag(en)",
        step2_relative: "Relative Angabe",
        step2_absolute: "Absolute Angabe",
        step2_days: "Tage",
        step2_weeks: "Wochen",
        step2_months: "Monate",
        step2_years: "Jahre",
        step2_info_day: "Es werden die Daten des letzten Tages angezeigt.",
        step2_info_week: "Es werden die Daten der letzten Woche angezeigt.",
        step2_info_month: "Es werden die Daten des letzten Monats angezeigt.",
        step2_info_year: "Es werden die Daten des letzten Jahres angezeigt.",
        step3_info: "Bitte auswählen, in welcher Form die Daten dargestellt werden sollen.",
        step4_info: "Bitte auswählen, auf welche Art die Daten auf dem Zeitdiagramm dargestellt werden sollen.",
        step5_options: "Mehr Optionen",
        step5_options_legende: "Legende",
        step5_options_tooltips: "Tooltips",
        step5_options_zoom: "Zoom",
        step5_options_export: "Export",
        step5_options_hide: "Optionen ausblenden",
        step5_options_axes: "Achsenbeschriftung",
        step5_options_axes_x: "X-Achsen Beschriftung eingeben...",
        step5_options_axes_y: "Y-Achsen Beschriftung eingeben...",
        step5_options_axes_y1: "Y-Achsen (1.Achse) Beschriftung eingeben...",
        step5_options_axes_y2: "Y-Achsen (2.Achse) Beschriftung eingeben...",
        step5_options_axes_y3: "Y-Achsen (3.Achse) Beschriftung eingeben...",
        step5_options_axes_y4: "Y-Achsen (4.Achse) Beschriftung eingeben...",
        step5_options_axes_y_unit: "Y-Achsen Einheit eingeben... (z.B. kWh)",
        step5_options_axes_y_unit1: "Y-Achsen (1.Achse) Einheit eingeben... (z.B. kWh)",
        step5_options_axes_y_unit2: "Y-Achsen (2.Achse) Einheit eingeben... (z.B. kWh)",
        step5_options_axes_y_unit3: "Y-Achsen (3.Achse) Einheit eingeben... (z.B. kWh)",
        step5_options_axes_y_unit4: "Y-Achsen (4.Achse) Einheit eingeben... (z.B. kWh)",
        step5_options_dataseries: "Datenserien",
        step5_options_save: "Änderungen übernehmen",
        step5_options_helplines: "Hilfslinien",
        step5_options_avglines: "Durchschnitslinie einfügen",
        step5_options_maxlines: "Max- Linie einfügen",
        step5_options_medlines: "Medianlinie einfügen",
        step5_options_minlines: "Min- Linie einfügen",
        step5_options_ownlines: "Eigene Linie einfügen",
        step5_options_functions: "Funktionen",
        step5_options_addaxes: "Achsen einfügen/entfernen",
        tooltip_chart1: "Keine Zeitserien-Daten ausgewählt",
        tooltip_chart2: "Mindestens zwei Items benötigt",
        tooltip_chart3: "Nur ein Item auswählbar für diesen Chart",
        tooltip_chart4: "Nicht möglich mit aktueller Datenauswahl",
        tooltip_chart5: "Keine Hierarchien ausgewählt",
        chart_aggregate: "Zur Darstellung der ausgewählten Daten in diesem Diagrammtyp müssen die Daten zusammengefasst werden:",
        chart_aggregate_sum: "Summe der Werte",
        chart_aggregate_avg: "Durchschnitt der Werte",
        chart_aggregate_min: "Minumum der Werte",
        chart_aggregate_max: "Maximum der Werte",
        chart_type: "Bitte auswählen, wie die Daten in dem ausgewählten Diagramm dargestellt werden sollen.",
        chart_type_line: "Linien-Diagramm",
        chart_type_bar: "Balken-Diagramm",
        chart_type_area: "Flächen-Diagramm",
        chart_type_point: "Punkt-Diagramm",
        chart_type_heat_week: "Wochen-Heatmap",
        chart_type_heat_year: "Jahres-Heatmap",
        chart_type_spider_daylie: "Tagesprofil",
        chart_type_spider_stats: "Statistiken",
        chart_type_histo_absolute: "Absolute-Häufigkeiten",
        chart_type_histo_week: "Wochen-Verteilung",
        chart_circle: "Kreis",
        chart_donut: "Donut",
        tooltip_zoom: "Erlaubt das Zoomen im Graphen",
        tooltip_nozoom: "Zoomen nicht möglich",
        tooltip_export: "Export der Rohdaten als CSV",
        tooltip_legend: "Zeigt die Legende zu den Datenserien",
        tooltip_tooltip: "Zeigt Informationen zu markierten Datenpunkten",


        chart_type_time: "Zeit-Diagramm",
        chart_type_circle: "Kreis-Diagramm",
        chart_type_heatmap: "Heatmap-Diagramm",
        chart_type_spider: "Spider-Diagramm",
        chart_type_histo: "Histogramm",
        chart_type_hier: "Hierarchie-Diagramm"








      },
      js: {
        month1: "Januar",
        month2: "Februar",
        month3: "März",
        month4: "April",
        month5: "Mai",
        month6: "Juni",
        month7: "Juli",
        month8: "August",
        month9: "September",
        month10: "Oktober",
        month11: "November",
        month12: "Dezember",
        eud_error: "Es wurde entweder keine Datenquelle ausgewählt oder es liegen keine Daten zu der Quelle vor.",
        average: "Durchschnitt",
      }
    },
    widgets: {
      general: {
        no_settings: "Dieses Widget hat keine Einstellungen.",
      },
      kpi: {
        settings_left: "Links",
        settings_right: "Rechts",
        settings_volume: "Volumen",
        settings_percent: "Prozent",
        settings_watt: "Leistung, Watt",
        settings_temp: "Temperatur",
        settings_decibal: "Dezibel",
        settings_liter: "Liter",
        settings_ppm: "PPM",
        settings_info: "Info",
        settings_hashtag: "Raute",
        settings_arrow: "Pfeil",
      },
      live: {
        settings_axis: "Y-Achsen verknüpfen?",
        settings_yes: "Ja",
        settings_no: "Nein"
      },
      table: {
        settings_1day: "1 Tag",
        settings_7days: "7 Tage",
        settings_14days: "14 Tage",
        settings_30days: "30 Tage",
        settings_60days: "60 Tage",
        settings_100days: "100 Tage",
        settings_356days: "365 Tage"
      }
    },
    languages: {
      "en.label": "Englisch",
      "de.label": "Deutsch"
    }
  }
];

//{{ "widgets.kpi.report.settings_left" | translate }}
//$translate("ow.reporting.report_standard_label2").then((translate1) => { });
//$translate = $injector.get("$translate");