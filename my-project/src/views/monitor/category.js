export const expandedKeys = ['0', '2-0-0', '2-0-1', '2-0-2', '2-1', '2-2', '2-3']

export const category = [
  {
    title: '一、学校概要数据',
    key: '0',
    children: [
      { title: '1.学校基本情况', key: '0-0' },
      { title: '2.学位点概况', key: '0-1' },
      { title: '3.学校专业基本情况', key: '0-2' }
    ]
  },
  {
    title: '二、学校教育教学核心数据',
    key: '1'
  },
  {
    title: '三、审核评估指标监测数据',
    key: '2',
    children: [
      {
        title: '1.办学方向与本科地位',
        key: '2-0',
        children: [
          {
            title: '1.1 党的领导',
            key: '2-0-0',
            children: [
              { title: '(1)校领导人员结构', key: '2-0-0-0' },
              { title: '(2)校级教学管理人员', key: '2-0-0-1' },
              { title: '(3)师生党员人数及发展情况', key: '2-0-0-2' }
            ]
          },
          {
            title: '1.2 思政教育',
            key: '2-0-1',
            children: [
              { title: '(1)思政课教师队伍', key: '2-0-1-0' },
              { title: '(2)课程思政示范课', key: '2-0-1-1' },
              { title: '(3)思政课和课程思政教学团队...', key: '2-0-1-2' }
            ]
          },
          {
            title: '1.3 本科地位',
            key: '2-0-2',
            children: [
              { title: '(1)经费投入情况', key: '2-0-2-0' },
              { title: '(2)教学、科研仪器设备情况', key: '2-0-2-1' }
            ]
          }
        ]
      },
      {
        title: '2.培养过程',
        key: '2-1',
        children: [
          { title: '2.1 培养方案', key: '2-1-0' },
          { title: '2.2 专业建设', key: '2-1-1' },
          { title: '2.3 实践教学', key: '2-1-2' },
          { title: '2.4 课堂教学', key: '2-1-3' },
          { title: '2.5 卓越培养', key: '2-1-4' },
          { title: '2.6 双创教育', key: '2-1-5' }
        ]
      },
      {
        title: '3.教学资源与利用',
        key: '2-2',
        children: [
          { title: '3.1 设施条件', key: '2-2-0' },
          { title: '3.2 资源建设', key: '2-2-1' }
        ]
      },
      {
        title: '4.教师队伍',
        key: '2-3',
        children: [
          { title: '4.1 师德师风', key: '2-3-0' },
          { title: '4.2 教学能力', key: '2-3-1' },
          { title: '4.3 教学投入', key: '2-3-2' },
          { title: '4.4 教师发展', key: '2-3-3' }
        ]
      },
      {
        title: '5.学生发展',
        key: '2-4'
      },
      {
        title: '6.质量保障',
        key: '2-5'
      }
    ]
  }
]
