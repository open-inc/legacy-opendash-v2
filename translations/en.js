export default [
  "en",
  {
    ow: {
      reporting: {
        createScheduled: "Create a new periodic report"
      }
    },
    od: {
      core: {},
      auth: {
        login: "Login",
        login_fail: "Username or Password wrong",
        signup: "Create Account",
        logout: "Logout",
        pw: "Reset Password",
        noaccount: "No account yet? Click here.",
        hasaccount: "You already have an account? Click here.",
        resetpassword: "Forgot your password? Click here.",
        signup_success:
          "Account successfully created. You will be redirected in 5 seconds.",
        signup_fail: "Account could not be created.",
        reset_pw:
          "You will shortly receive an e-mail with further instructions.",
        input: {
          email: "Email",
          password: "Password",
          password_repeat: "Repeat Password",
          password_missmatch: "The given passwords do not match.",
          location_city: "City Name",
          location_lat: "GPS Latitude",
          location_long: "GPS Longitude"
        },
        button: {
          login: "Login",
          signup: "Signup",
          resetpw: "Reset"
        }
      },
      header: {
        dashboards: {
          header: "Dashboards",
          manage: "Manage Dashboards",
          edit_mode_button: "Edit Mode",
          create: "Create a new Dashboard",
          create_prompt:
            "Please enter names for new dashboard and click create.",
          delete: "Delete current Dashboard",
          delete_prompt:
            "Are you sure you want to delete the current Dashboard?",
          active: "active",
          shared: "shared",
          edit: "Share current Dashboard"
        },
        widgets: {
          header: "Widgets",
          presets: "Add from Template",
          eud: "Creating a New Analysis"
        },
        user: {
          greeting: "Hello,",
          profile_alt: "User profile picture"
        }
      },
      user: {
        settings: {
          account: {
            header: "Account Settings",
            action: "Account Settings",
            password: {
              header: "Change Password",
              password: "New Password",
              password_repeat: "Repeat Password",
              password_missmatch: "The given passwords do not match.",
              success: "Password changed",
              error: "Password could not be changed"
            }
          },
          data: {
            header: "User-defined names for sensors",
            action: "Customize Sensors",
            col_default: "Default Name",
            col_custom: "Custome Name",
            click_to_edit: "Click to Edit",
            success: "Names saved.",
            error: "Names could not be saved"
          },
          language: {
            action: "Change language",
            info:
              "Please select your preferred language. The selection will be saved on the device and will be preferred for further sessions."
          }
        }
      },
      dashboard: {
        empty: {
          message: "No Widgets found :(",
          action: "Add Widget from Template"
        },

        widgets: {
          add: "Add Widget from Template",
          rename: "Give the Widget a new name:",
          remove:
            "Do you really want to remove the Widget from your Dashboard?",
          configurate: "Configure",
          noconfig: "This Widget must be configured.",
          nodata: "No Data available.",
          save: "Save",
          abort: "Cancel"
        },
        errors: {
          init: "Dashboard could not be loaded. Please contact support.",
          create: "Dashboard could not be created.",
          change: "Dashboard could not be creaswitchedted.",
          delete: "Dashboard could not be deleted."
        }
      },
      presets: {
        add: "Add"
      },
      select: {
        start: "Start Date:",
        end: "End Date:",
        since: "Scince:",
        item: {
          label: "Select Sensors",
          empty: "No Sensors found.",
          search: "Search for Sensors..."
        },
        icon: {
          label: "Choose Icon",
          placeholder: "No icon has been selected yet."
        },
        location: {
          label: "Select Facility",
          empty: "No Facility found.",
          search: "Search for Facilities...",
          min: "At least one Facility must be selected."
        }
      },
      ui: {
        ok: "OK",
        save: "Save",
        delete: "Delete",
        cancel: "Cancel",
        prev: "Back",
        next: "Next",
        notimplemented: "This operation is not supported."
      }
    },
    languages: {
      "en.label": "English",
      "de.label": "German"
    }
  }
];
