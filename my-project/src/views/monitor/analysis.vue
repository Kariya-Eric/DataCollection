<template>
  <div>
    <card-header />
    <a-row :gutter="24">
      <a-col :span="8">
        <teacher-info-card />
      </a-col>
      <a-col :span="16">
        <personal-structure-card />
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-top: 24px">
      <a-col :span="8">
        <subject-description-card />
      </a-col>
      <a-col :span="16">
        <subject-info-card />
      </a-col>
    </a-row>

    <a-row :gutter="24" style="margin-top: 24px">
      <a-col :span="8">
        <course-description-card />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import CardHeader from './components/card-header.vue'
import PersonalStructureCard from './components/personal-structure-card.vue'
import TeacherInfoCard from './components/teacher-info-card.vue'
import SubjectInfoCard from './components/subject-info-card.vue'
import SubjectDescriptionCard from './components/subject-description-card.vue'
import CourseDescriptionCard from './components/course-description-card.vue'
export default {
  components: { CardHeader, TeacherInfoCard, PersonalStructureCard, SubjectInfoCard, SubjectDescriptionCard, CourseDescriptionCard },
  name: 'MonitorAnalysis',
  data() {
    return {}
  }
}
</script>

<style scoped lang="less"></style>
