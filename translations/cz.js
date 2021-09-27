export default [
    "ch",
    {
      ow: {
        reporting: {
          create: "创建标准报告",
          createGreis: "创建称重数据报告",
          createScheduledGreis: "常规称重数据报告",
          history: "以前的报告",
          download_start: "将下载报告",
          download_error: "无法下载报告",
          report: {
            title: "标题",
            description: "描述",
            show_as_table: "显示为表格",
            show_as_graph: "显示为图形"
          },
          createScheduled: "创建新的定期报告",
          title: "创建位置报告:",
          report_standard_label1: "15分钟",
          report_standard_label2: "1小时",
          report_standard_label3: "1 天",
          report_standard_label4: "7 天",
          report_standard_label5: "来源",
          report_standard_label6: "代表性",
          report_standard_label7: "时间跨度",
          report_standard_label8: "报告设置",
          report_download_desc: "点击图标，将创建报告。之后将自动下载。"
        },
        sidebar: {
          topbar_toggle: "侧栏",
          location: {
            tab_label: "设施"
          },
          sensors: {
            tab_label: "传感器"
          },
          events: {
            tab_label: "事件"
          },
          data: {
            name: "姓名",
            current: "当前",
            refresh: "上次更改",
            change: "改变",
            alarm: "警报"
          }
        },
        hero: {
          filter: "过滤器"
        },
        alarm: {
          localisation: "邮件语言",
          localisation_DE: "德语",
          localisation_EN: "英语",
          create_tab_label: "创建新电子邮件警报",
          delete_tab_label: "报警概述",
          name_label: "报警名称",
          mail_label: "用于通知的电子邮件地址（以“；”分隔）",
          add_text_label: "电子邮件正文的附加文本",
          alarm_type_label: "选择报警触发器",
          min_label: "最小值",
          max_label: "最大值",
          notification_type_label: "通知类型",
          interval_label: "通知间隔",
          create_title: "创建报警",
          cancel_label: "取消",
          submit_label: "创建报警",
          edit_label: "保存更改",
          list_error: "无法加载报警",
          create_success: "报警已成功创建",
          create_error: "无法创建报警.",
          edit_success: "报警已成功编辑",
          edit_error: "无法编辑报警",
          delete_success: "警报已成功清除.",
          delete_error: "无法清除报警.",
          delExisting: "删除现有报警",
          existName: "名称",
          existFirstVal: "最小值",
          existSecVal: "最大值",
          existBoolType: "类型",
          existMail: "收件人",
          existDel: "删除",
          viamail:"通过电子邮件",
          everyTime: "每次",
          onceHour: "每小时最多一次",
          onceDay: "每天最多一次",
          onceWeek: "每周最多一次",
          onceMonth: "每月最多一次",
          onceReset: "每次边缘更改后一次",
          triggerEvery: "每个新值",
          triggerNumberOvershot: "超过一个值",
          triggerNumberUndershot: "降低值",
          triggerNumberBoth: "低于或超过某个值",
          triggerBoolFalsetoTrue: "从假到真",
          triggerBoolTruetoFalse: "从真到假",
          triggerBoolEveryChange: "每一次变化",
          triggerBoolEveryTrue: "对于每个真值",
          triggerBoolEveryFalse: "对于每个假值",
          triggerStringContainsChars: "该值包含以下字符串",
          triggerStringNotContainsChars: "该值不包含以下字符串",
          triggerStringIsEqual: "该值对应（等于）以下字符串",
          triggerStringNotEqual: "该值不对应（不等于）以下字符串",
          triggerStringStartsWith: "该值以以下字符串开头",
          triggerStringNotStartsWith: "该值不以以下字符串开头",
          triggerStringEndsWith: "该值以以下字符串结尾",
          triggerStringNotEndsWith: "该值不以以下字符串结尾",
          overviewUnder: "少于",
          overviewOver: "大于",
          listName: "名称",
          listFreq: "频率",
          listSettings: "设置",
          listRecipent: "收件人",
          listEdit: "编辑",
          listDel: "删除",
        },
        admin: {
          overview: {
            tab_user: "用户管理",
            tab_location: "设施管理",
            tab_sensor: "传感器管理",
            adduser: "添加用户",
            delchange: "放弃更改",
            editmode: "编辑模式",
            savechange: "保存更改",
            addfac: "添加设施",
            password: "密码",
            delete: "删除",
            ident: "名称",
            city: "城市",
            adress: "地址",
            postcode: "邮政编码",
            province: "省",
            gartype: "废料类型",
            priceunit: "单位价格"
          },
          sensors: {
            header: "传感器管理",
            col_sensor_active: "记录传感器数据（传感器开/关）",
            col_sensor_visible: "显示传感器数据（显示/隐藏传感器）",
            col_sensor_editid: "C更改数据源的标识",
            col_sensor_editiddescr:
              "注意！更改数据源的标识可能导致必须分配新的授权。数据与新更改一起保存，无法与当前数据合并！",
            col_id_source: "传感器和数据源",
            col_id: "中间件ID",
            col_name: "姓名",
            col_value_type: "数据类型",
            col_value_type_name: "名称",
            col_value_type_unit: "单位",
            col_value_type_min: "最小值",
            col_value_type_max: "最大值",
            col_active: "活动",
            col_edit_sensor: "",
            contains_values: "包含以下值",
            click_to_edit: "点击编辑",
            success: "已存储传感器.",
            error: "无法存储传感器.",
            modal: {
              title: "传感器设置"
            }
          },
          user: {
            create_title: "创建新用户",
            name_label: "姓名",
            email_label: "电子邮件",
            password_label: "密码",
            password_repeat_label: "密码（重复）",
            cancel_label: "取消",
            submit_label: "创建新用户",
            create_success: "用户已创建",
            create_error: "创建用户时出错."
          },
          location: {
            create_title: "创建新位置",
            name_label: "姓名",
            city_label: "城市",
            adress_label: "地址",
            plz_label: "邮政编码",
            bundesland_label: "国家",
            lat_label: "纬度",
            long_label: "经度",
            spsid_label: "SPSID",
            cancel_label: "取消",
            submit_label: "创建位置",
            create_success: "位置已创建.",
            create_error: "创建位置时出错."
          }
        }
      },
      greis: {
        cards: {
          admin_title: "转发器卡",
          unsupported_location: "此设备不支持转发器.",
          changes: "您有{count}}个更改，请按save.",
          number: "转发器编号",
          owner: "承租人",
          desc: "描述",
          misc: "添加",
          misc2: "其他",
          new: "( 新 )",
          deleted: "( 已删除 )",
          typehere: "单击此处编辑…",
          import: "导入",
          export: "导出"
        },
        widgets: {
          table: {
            month_next: "再过一个月",
            month_prev: "无可用数据",
            search: "单击此处搜索…",
            no_data: "无可用数据",
            no_data: "无可用数据",
            no_data: "无可用数据",
            col_customer: "客户",
            col_device: "设备",
            col_scannr: "扫描编号",
            col_timespan: "周期",
            col_last_time: "上次测量",
            col_weight_sum: "总重量",
            col_weight_tara: "称重数量（净）",
            col_weight_netto: "第二次称重（皮重）",
            col_weight_brutto: "首次称重（总重量）"
          },
          spstable: {
            no_data: "无可用数据",
            col_date: "日期",
            col_time: "时间",
            col_ophours: "营业时间",
            col_fillinglevel: "填充级别（%）",
            col_quarterfull: "75%满",
            col_fullfull: "100%满",
            col_nothalt: "紧急停止",
            col_ready: "准备运行",
            col_errorwirbler: "其他错误",
            col_errorschnecke: "前缀错误"
          }
        }
      },
      od: {
        core: {},
        greis: {
          report_adhoc: "新报告",
          report_modal_topic: "为创建报告",
          report_modal_button_create: "创建报告",
          report_select_timespan: "为报告选择时间跨度：",
          report_timed_info1: "没有报告计划为:",
          report_timed_info2: "",
          report_timed_info3: "报告名称：",
          report_timed_info4: "接收者:",
          report_timed_button: "创建新的定期报告",
          report_timed_label1: "报告名称",
          report_timed_label2: "定义间隔",
          report_timed_label3: "接收每日报告（24小时报告）",
          report_timed_label4: "收到每周报告（7天报告）",
          report_timed_label5: "每月收到一份报告（月报）",
          report_timed_label6: "每三个月收到一份报告（季度报告）",
          report_timed_label7: "每六个月收到一份报告（半年报告）",
          report_timed_label8: "每年收到一份报告（年度报告）",
          report_timed_label9: "报告电子邮件收件人",
          report_timed_label10: "创建报告",
          report_timed_label11: "管理计划的报告",
        },
        auth: {
          login: "登录",
          login_fail: "用户名或密码错误",
          signup: "创建帐户",
          logout: "注销",
          pw: "重置密码",
          noaccount: "还没有账户吗？单击此处.",
          hasaccount: "你已经有一个帐户了吗？单击此处.",
          resetpassword: "忘记密码了吗？单击此处.",
          signup_success:
            "已成功创建帐户。您将在5秒内被重定向.",
          signup_fail: "无法创建帐户.",
          reset_pw:
            "您将很快收到一封电子邮件，其中包含进一步的说明.",
          input: {
            email: "电子邮件",
            password: "密码",
            password_repeat: "重复密码",
            password_missmatch: "密码错误.",
            location_city: "城市名称",
            location_lat: "GPS纬度",
            location_long: "GPS经度"
          },
          button: {
            login: "登录",
            signup: "注册",
            resetpw: "重置"
          }
        },
        header: {
          dashboards: {
            header: "仪表板",
            manage: "管理仪表盘",
            edit_mode_button: "编辑模式",
            create: "创建新的仪表板",
            create_prompt:
              "请输入新仪表板的名称，然后单击“创建”.",
            delete: "删除当前仪表板",
            delete_prompt:
              "确实要删除当前仪表板吗？",
            active: "活动",
            shared: "共享",
            edit: "共享当前仪表板"
          },
          widgets: {
            header: "小组件",
            presets: "从模板添加",
            eud: "创建新的分析"
          },
          user: {
            greeting: "你好,",
            profile_alt: "用户配置文件图片"
          }
        },
        user: {
          settings: {
            account: {
              header: "帐户设置",
              action: "帐户设置",
              password: {
                header: "更改密码",
                password: "新密码",
                password_repeat: "重复密码",
                password_missmatch: "输入密码不正确.",
                success: "密码已更改",
                error: "无法更改密码"
              }
            },
            data: {
              header: "用户给传感器定义的名称",
              action: "定制传感器",
              col_default: "默认名称",
              col_custom: "客户名称",
              click_to_edit: "点击编辑",
              success: "保存姓名.",
              error: "无法保存名称"
            },
            language: {
              action: "更改语言",
              info:
                "请选择您喜欢的语言。所选内容将保存在设备上，并优先用于后续会话."
            }
          }
        },
        dashboard: {
          empty: {
            message: "未找到小组件 :(",
            action: "从模板添加小组件"
          },
  
          widgets: {
            add: "从模板添加小组件",
            rename: "给小组件一个新名称：",
            remove:
              "是否确实要从仪表板中删除小组件?",
            configurate: "配置",
            noconfig: "必须配置此小组件.",
            nodata: "没有可用的数据.",
            save: "保存",
            abort: "取消"
          },
          errors: {
            init: "无法加载仪表板。请与技术支持联系.",
            create: "无法创建仪表板.",
            change: "无法更改仪表板开关.",
            delete: "无法删除仪表板."
          }
        },
        presets: {
          add: "添加",
          title: "将模板添加到仪表板"
        },
        select: {
          start: "开始日期:",
          end: "结束日期:",
          since: "自:",
          item: {
            label: "选择传感器",
            empty: "未找到传感器.",
            search: "搜索传感器…"
          },
          icon: {
            label: "选择图标",
            placeholder: "尚未选择任何图标."
          },
          location: {
            label: "选择设施",
            empty: "未找到任何设施.",
            search: "搜索设施…",
            min: "至少选择一个设施."
          }
        },
        ui: {
          ok: "OK",
          save: "保存",
          delete: "删除",
          cancel: "取消",
          prev: "后退",
          next: "下一步",
          notimplemented: "不支持此操作."
        }
        ,
        eud: {
          title_step1: "选择数据源",
          title_step2: "选择时间跨度",
          title_step3: "选择图表",
          title_step4: "图表设置",
          title_step5: "预览",
          step1_icon: "项目",
          step2_icon: "时间跨度",
          step3_icon: "图表",
          step4_icon: "设置",
          step5_icon: "预览",
          button_before: "后退",
          button_next: "下一步",
          button_save: "保存",
          step2_info1: "最后一次的数据",
          step2_info2: "已显示.",
          step2_info1a: "时间跨度为",
          step2_info2a: "日",
          step2_relative: "有关联",
          step2_absolute: "绝对",
          step2_days: "天",
          step2_weeks: "周",
          step2_months: "月",
          step2_years: "年",
          step2_info_day: "将显示最后一天的数据.",
          step2_info_week: "将显示上周的数据.",
          step2_info_month: "将显示上个月的数据.",
          step2_info_year: "将显示上一年的数据.",
          step3_info: "请选择数据的表示方式.",
          step4_info: "请优化可视化设置.",
          step5_options: "更多选项",
          step5_options_legende: "图例",
          step5_options_tooltips: "工具提示",
          step5_options_zoom: "缩放",
          step5_options_export: "导出",
          step5_options_hide: "隐藏选项",
          step5_options_axes: "轴标签",
          step5_options_axes_x: "输入x轴标签…",
          step5_options_axes_y: "输入y轴标签…",
          step5_options_axes_y1: "输入Y轴（1.轴）标签…",
          step5_options_axes_y2: "输入Y轴（2.轴）标签…",
          step5_options_axes_y3: "输入Y轴（3.轴）标签…",
          step5_options_axes_y4: "输入Y轴（4.轴）标签…",
          step5_options_axes_y_unit: "输入y轴值的单位…",
          step5_options_axes_y_unit1: "输入y轴（1.轴）值的单位…",
          step5_options_axes_y_unit2: "输入y轴（2.轴）值的单位…",
          step5_options_axes_y_unit3: "输入y轴（3.轴）值的单位…",
          step5_options_axes_y_unit4: "输入y轴（4.轴）值的单位…",
          step5_options_dataseries: "数据系列",
          step5_options_save: "更新图表",
          step5_options_helplines: "帮助热线",
          step5_options_avglines: "添加平均线",
          step5_options_maxlines: "添加最大线",
          step5_options_medlines: "添加中位线",
          step5_options_minlines: "添加最小行",
          step5_options_ownlines: "添加自定义行",
          step5_options_functions: "功能",
          step5_options_addaxes: "添加/删除轴",
          tooltip_chart1: "未选择时间序列数据",
          tooltip_chart2: "“至少需要两个源",
          tooltip_chart3: "此图表只需要一个源",
          tooltip_chart4: "当前选择不可行",
          tooltip_chart5: "在数据中找不到层次结构",
          chart_aggregate: "要在此类图表中显示数据，需要聚合:",
          chart_aggregate_sum: "值之和",
          chart_aggregate_avg: "值的平均值",
          chart_aggregate_min: "值的最小值",
          chart_aggregate_max: "最大值",
          chart_type: "请选择数据在所选图表中的显示方式.",
          chart_type_line: "折线图",
          chart_type_bar: "条形图",
          chart_type_area: "面积图",
          chart_type_point: "点图",
          chart_type_heat_week: "每周",
          chart_type_heat_year: "年度",
          chart_type_spider_daylie: "Daylie-配置文件",
          chart_type_spider_stats: "统计数据",
          chart_type_histo_absolute: "总分布",
          chart_type_histo_week: "周分布",
          chart_circle: "圆",
          chart_donut: "圈",
          tooltip_zoom: "允许缩放”",
          tooltip_nozoom: "无法缩放",
          tooltip_export: "将数据导出为CSV",
          tooltip_legend: "显示图表图例",
          tooltip_tooltip: "在鼠标上方显示工具提示",
          chart_type_time: "时间图表",
          chart_type_circle: "圆形图",
          chart_type_heatmap: "热图",
          chart_type_spider: "蜘蛛图",
          chart_type_histo: "直方图",
          chart_type_hier: "层次结构图"
        },
        js: {
          month1: "一月",
          month2: "二月",
          month3: "三月",
          month4: "四月",
          month5: "五月",
          month6: "六月",
          month7: "七月",
          month8: "八月",
          month9: "九月",
          month10: "十月",
          month11: "十一月",
          month12: "十二月",
          eud_error: "没有选择数据或没有选择源.",
          average: "平均值",
        }
      },
      widgets: {
        general: {
          no_settings: "此小组件没有设置.",
        },
        kpi: {
          settings_left: "左",
          settings_right: "右",
          settings_volume: "音量",
          settings_percent: "百分比",
          settings_watt: "功率",
          settings_temp: "温度",
          settings_decibal: "分贝",
          settings_liter: "升",
          settings_ppm: "PPM",
          settings_info: "信息",
          settings_hashtag: "标签",
          settings_arrow: "箭头",
        },
        live: {
          settings_axis: "链接Y轴?",
          settings_yes: "是",
          settings_no: "否"
        },
        table: {
          settings_1day: "1 天",
          settings_7days: "7 天",
          settings_14days: "14 天",
          settings_30days: "30 天",
          settings_60days: "60 天",
          settings_100days: "100 天",
          settings_356days: "365 天",
          timerange: "时间范围",
          col_item_name: "设备",
          col_timestamp: "日期",
          search: "在此处键入以搜索…",
          month_next: "下个月",
          month_prev: "上个月",
          no_data: "找不到任何数据…"
        }
      },
      new_components: {
        manuel: {
          title: "清空时手动输入填充量",
          choose_facility: "请选择手动输入的设备:",
          choose_emptying: "请选择一个自动检测到的清空:",
          input_weight: "请输入清空的填充量（Kg）:",
          send_button: "发送手动输入",
          cancel_button: "删除输入",
          send_success: "数据发送成功! ",
          send_error: "发送错误！请稍后再试.",
        }
      },
      languages: {
        "en.label": "English",
        "de.label": "German",
        "nl.label": "Dutch",
        "ch.label": "Chinese",
      }
    }
  ];
  