export default [
  "en",
  {
    od: {
      core: {},
      auth: {
        login: "Login",
        signup: "Create Account",
        logout: "Logout",
        noaccount: "No Account? Click Here",
        resetpassword: "Forgot Password? Click Here",
        button: {
          login: "Login",
          signup: "create"
        }
      },
      header: {
        dashboards: {
          header: "Dashboards",
          manage: "Manage Dashboards",
          create: "Create new Dashboard",
          create_prompt: "Please enter a name for the new Dashboard!",
          delete: "Delete currently selected Dashboard",
          delete_prompt:
            "Are you sure you want to delete the current Dashboard?"
        },
        widgets: {
          header: "Widgets",
          presets: "Add Widget from template",
          eud: "Create new analytic Widget"
        },
        user: {
          greeting: "Hello,",
          profile_alt: "Nutzer Profilbild"
        }
      },
      dashboard: {
        empty: {
          message: "No Widgets found :(",
          action: "Add Widget from presets"
        },
        widgets: {
          add: "Add Widget from template",
          rename: "Provide a name for the widget:",
          remove: "Are you sure you want to delete the widget?",
          configurate: "Settings",
          noconfig: "Please configure the widget",
          nodata: "This widget doesn't receive data",
          save: "Save",
          abort: "Cancel"
        },
        errors: {
          init: "Could not load dashboard. Please contact support.",
          create: "Could not create dashboard.",
          change: "Could not change dashboard.",
          delete: "Could not delete dashboard."
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
          label: "Select Sensor",
          empty: "No result available",
          search: "Search for an item name..."
        },
        icon: {
          label: "Icon",
          placeholder: "None selected."
        },
        location: {
          label: "Select location",
          empty: "No result available",
          search: "Search for a location..."
        }
      },
      ui: {
        ok: "OK",
        cancel: "Cancel",
        prev: "Back",
        next: "Next"
      }
    }
  }
];
