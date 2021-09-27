export default [
  "en",
  {
    ow: {
      reporting: {
        createScheduled: "Create a new periodic report",
        title: "Creating a Report for Locations:",
        report_standard_label1: "15 Minutes",
        report_standard_label2: "1 Hour",
        report_standard_label3: "1 Day",
        report_standard_label4: "7 Days",
        report_standard_label5: "Sources",
        report_standard_label6: "Representation",
        report_standard_label7: "Timespan",
        report_standard_label8: "Report Settings",
        report_download_desc: "With a click on the Icon the Report will be created. Afterwards it will be downloaded automatically."
      }
    },
    od: {
      core: {},
      datetime:{
        seconds:"Second(s)",
        minutes:"Minute(s)",
        hours:"Hour(s)",
        days:"Day(s)", 
        weeks:"Week(s)",
        months:"Month(s)",
        years:"Year(s)",
        timeframe: "Timespan"

      },
      datadisplay:{
        c2clip : "Copied to clipboard "
      },
      greis: {
        report_adhoc: "New Report",
        report_modal_topic: "Creating Report for",
        report_modal_button_create: "Create Report",
        report_select_timespan: "Select Timespan for the Report:",
        report_timed_info1: "No Report planned for:",
        report_timed_info2: "",
        report_timed_info3: "Name of the Report:",
        report_timed_info4: "Receiver:",
        report_timed_button: "Create new regular Report",
        report_timed_label1: "Name for the Report",
        report_timed_label2: "Define the interval",
        report_timed_label3: "Receive a daily report (24-hour report)",
        report_timed_label4: "Receive a weekly report (7-day report)",
        report_timed_label5: "Receive a report every month (monthly report)",
        report_timed_label6: "Receive a report every third month (quarterly report)",
        report_timed_label7: "Receive a report every six months (semi-annual report)",
        report_timed_label8: "Receive a report annually (annual report)",
        report_timed_label9: "Report E-Mail Recipient",
        report_timed_label10: "Create Report",
        report_timed_label11: "Manage scheduled reports for",
      },
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
            "Please enter a name for a new dashboard and click create.",
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
          eud: "Create a new Analysis"
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
        add: "Add",
        title: "Add Template to Dashboard"
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
      ,
      eud: {
        title_step1: "Choose the Datasources",
        title_step2: "Choose the Timespan",
        title_step3: "Choose the Chart",
        title_step4: "Settings for the Chart",
        title_step5: "Preview",
        step1_icon: "Items",
        step2_icon: "Timespan",
        step3_icon: "Charts",
        step4_icon: "Settings",
        step5_icon: "Preview",
        button_before: "BACK",
        button_next: "NEXT",
        button_save: "SAVE",
        step2_info1: "Data for the last",
        step2_info2: "are displayed.",
        step2_info1a: "Timespan is",
        step2_info2a: "Day(s)",
        step2_relative: "Relative",
        step2_absolute: "Absolute",
        step2_days: "Days",
        step2_weeks: "Weeks",
        step2_months: "Months",
        step2_years: "Years",
        step2_info_day: "Data for the last Day will be displayed.",
        step2_info_week: "Data for the last Week will be displayed.",
        step2_info_month: "Data for the last Month will be displayed.",
        step2_info_year: "Data for the last Year will be displayed.",
        step3_info: "Please choose how the data should be represented.",
        step4_info: "Please refine the settings for the visualization.",
        step5_options: "More Options",
        step5_options_legende: "Legend",
        step5_options_tooltips: "Tooltips",
        step5_options_zoom: "Zoom",
        step5_options_export: "Export",
        step5_options_hide: "Hide Options",
        step5_options_axes: "Axis Labeling",
        step5_options_axes_x: "Enter X-Axis Label...",
        step5_options_axes_y: "Enter Y-Axis Label...",
        step5_options_axes_y1: "Enter Y-Axis (1. Axis) Label...",
        step5_options_axes_y2: "Enter Y-Axis (2. Axis) Label...",
        step5_options_axes_y3: "Enter Y-Axis (3. Axis) Label...",
        step5_options_axes_y4: "Enter Y-Axis (4. Axis) Label...",
        step5_options_axes_y_unit: "Enter Unit of Y-Axis Values...",
        step5_options_axes_y_unit1: "Enter Unit of Y-Axis (1. Axis) Values...",
        step5_options_axes_y_unit2: "Enter Unit of Y-Axis (2. Axis) Values...",
        step5_options_axes_y_unit3: "Enter Unit of Y-Axis (3. Axis) Values...",
        step5_options_axes_y_unit4: "Enter Unit of Y-Axis (4. Axis) Values...",
        step5_options_dataseries: "Data-Series",
        step5_options_save: "Update Chart",
        step5_options_helplines: "Helplines",
        step5_options_avglines: "Add Line for Average",
        step5_options_maxlines: "Add Maximum Line",
        step5_options_medlines: "Add Median Line",
        step5_options_minlines: "Add Minimum Line",
        step5_options_ownlines: "Add custom Line",
        step5_options_functions: "Function",
        step5_options_addaxes: "Add/Remove Axis",
        tooltip_chart1: "No Timeseries-Data selected",
        tooltip_chart2: "A minimum of two Sources is required",
        tooltip_chart3: "Only one Source is needed for this chart",
        tooltip_chart4: "No possible with current Source selection",
        tooltip_chart5: "No Hierarchy found in the Data",
        chart_aggregate: "To display the Data in this kind of chart an aggregation is needed:",
        chart_aggregate_sum: "Sum of the Values",
        chart_aggregate_avg: "Average of the Values",
        chart_aggregate_min: "Minumum of the Values",
        chart_aggregate_max: "Maximum of the Values",
        chart_type: "Please choose how the Data should ne displayed in the selected Chart.",
        chart_type_line: "Line-Chart",
        chart_type_bar: "Bar-Chart",
        chart_type_area: "Area-Chart",
        chart_type_point: "Point-Chart",
        chart_type_heat_week: "Weekly",
        chart_type_heat_year: "Yearly",
        chart_type_spider_daylie: "Daylie-Profile",
        chart_type_spider_stats: "Statistics",
        chart_type_histo_absolute: "Total-Distribution",
        chart_type_histo_week: "Weekly-Distribution",
        chart_circle: "Circle",
        chart_donut: "Donut",
        tooltip_zoom: "Allows Zooming",
        tooltip_nozoom: "Zoom is not possible",
        tooltip_export: "Export Data as CSV",
        tooltip_legend: "Shows the Chart Legend",
        tooltip_tooltip: "Shows Tooltips on Mouseover",
        chart_type_time: "Time-Chart",
        chart_type_circle: "Circle-Chart",
        chart_type_heatmap: "Heatmap-Chart",
        chart_type_spider: "Spider-Chart",
        chart_type_histo: "Histogram",
        chart_type_hier: "Hierarchy-Chart"
      },
      js: {
        month1: "January",
        month2: "February",
        month3: "March",
        month4: "April",
        month5: "May",
        month6: "June",
        month7: "July",
        month8: "August",
        month9: "September",
        month10: "October",
        month11: "November",
        month12: "December",
        eud_error: "No Data from selection or no Source is selected.",
        average: "Average",
      }
    },
    widgets: {
      sharedHighlight:"Highlight selection from other widgets",
      sharedHighlight_Yes:"Higlight",
      sharedHighlight_No:"Do not highlight",
      general: {
        no_settings: "This Widget has no Settings.",
      },
      kpi: {
        settings_left: "Left",
        settings_right: "Right",
        settings_volume: "Volume",
        settings_percent: "Percent",
        settings_watt: "Power",
        settings_temp: "Temperature",
        settings_decibal: "Decibel",
        settings_liter: "Liter",
        settings_ppm: "PPM",
        settings_info: "Info",
        settings_hashtag: "Hashtag",
        settings_arrow: "Arrow",
      },
      live: {
        settings_axis: "Link Y-Axis?",
        settings_yes: "Yes",
        settings_no: "No"
      },
      table: {
        settings_1day: "1 Day",
        settings_7days: "7 Days",
        settings_14days: "14 Days",
        settings_30days: "30 Days",
        settings_60days: "60 Days",
        settings_100days: "100 Days",
        settings_356days: "365 Days"
      }
    },
    languages: {
      "en.label": "English",
      "de.label": "German"
    }
  }
];
