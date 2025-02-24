<!-- src/components/WebinarManager.vue -->
<template>
    <div class="webinar-manager">
      <!-- Main Interface -->
      <div class="header-section">
        <div class="left-section">
          <b-button 
            type="is-primary"
            icon-left="plus"
            @click="openCreateModal"
          >
            Create Webinar
          </b-button>
        </div>
        <h1 class="title">Webinar Management</h1>
      </div>
  
      <!-- Create Webinar Modal -->
      <b-modal
        v-model="isModalActive"
        has-modal-card
        trap-focus
        :destroy-on-hide="false"
        aria-role="dialog"
        aria-modal
      >
        <template #default="props">
          <form @submit.prevent="handleSubmit">
            <div class="modal-card" style="width: 960px">
              <header class="modal-card-head">
                <p class="modal-card-title">Create New Webinar</p>
                <button 
                  type="button"
                  class="delete" 
                  @click="props.close"
                />
              </header>
  
              <section class="modal-card-body">
                <!-- Steps Progress -->
                <b-steps
                  v-model="activeStep"
                  :has-navigation="false"
                  :animated="true"
                >
                  <!-- Step 1: General Information -->
                  <b-step-item
                    step="1"
                    label="General Information"
                    :clickable="false"
                  >
                    <div class="step-content">
                      <b-field label="Event Name" :type="{'is-danger': errors.eventName}"
                              :message="errors.eventName">
                        <b-input v-model="formData.eventName" required></b-input>
                      </b-field>
  
                      <b-field label="Organization Name">
                        <b-input v-model="formData.orgName" required></b-input>
                      </b-field>
  
                      <b-field label="Event Details">
                        <b-input
                          v-model="formData.eventDetails"
                          type="textarea"
                        ></b-input>
                      </b-field>
  
                      <div class="columns">
                        <div class="column">
                          <b-field label="Contact Name">
                            <b-input v-model="formData.contactName" required></b-input>
                          </b-field>
                        </div>
                        <div class="column">
                          <b-field label="Contact Email">
                            <b-input
                              v-model="formData.contactEmail"
                              type="email"
                              required
                            ></b-input>
                          </b-field>
                        </div>
                      </div>
  
                      <b-field label="Webinar URL">
                        <b-input v-model="formData.webinarUrl" required></b-input>
                      </b-field>
  
                      <b-field label="Client Redirect URL">
                        <b-input v-model="formData.clientRedirectUrl"></b-input>
                      </b-field>
  
                      <b-field label="Webinar Redirect URL">
                        <b-input v-model="formData.webinarRedirectUrl"></b-input>
                      </b-field>
                    </div>
                  </b-step-item>
  
                  <!-- Step 2: Schedule Configuration -->
                  <b-step-item
                    step="2"
                    label="Schedule"
                    :clickable="false"
                  >
                    <div class="step-content">
                      <HelloWorld 
                        v-model="formData.schedule"
                        @schedule-updated="handleScheduleUpdate"
                        :showSaveButton="false"
                      />
                    </div>
                  </b-step-item>
  
                  <!-- Step 3: Video Configuration -->
                  <b-step-item
                    step="3"
                    label="Video Settings"
                    :clickable="false"
                  >
                    <div class="step-content">
                      <b-field label="Video Quality">
                        <b-select v-model="formData.videoQuality" expanded>
                          <option value="720p">720p</option>
                          <option value="1080p">1080p</option>
                          <option value="1440p">1440p</option>
                        </b-select>
                      </b-field>
  
                      <b-field label="Recording Options">
                        <b-checkbox v-model="formData.enableRecording">
                          Enable Recording
                        </b-checkbox>
                      </b-field>
                    </div>
                  </b-step-item>
                </b-steps>
              </section>
  
              <footer class="modal-card-foot">
                <div class="footer-buttons">
                  <div class="left-buttons">
                    <b-button
                      v-if="activeStep > 0"
                      @click="previousStep"
                      type="is-light"
                    >
                      Previous
                    </b-button>
                  </div>
                  
                  <div class="right-buttons">
                    <b-button
                      v-if="activeStep < 2"
                      @click="nextStep"
                      type="is-primary"
                      :disabled="!canProceed"
                    >
                      Next
                    </b-button>
  
                    <b-button
                      v-if="activeStep === 2"
                      type="is-success"
                      @click="handleSubmit"
                      :disabled="!isFormValid"
                    >
                      Save Changes
                    </b-button>
  
                    <b-button
                      @click="props.close"
                      type="is-danger is-light"
                    >
                      Cancel
                    </b-button>
                  </div>
                </div>
              </footer>
            </div>
          </form>
        </template>
      </b-modal>
  
      <!-- Webinar History -->
      <div class="webinar-history mt-6">
        <h2 class="subtitle">Webinar History</h2>
        <b-table
          :data="webinarHistory"
          :columns="columns"
          striped
          hoverable
        >
          <template #empty>
            <div class="has-text-centered">No webinars found</div>
          </template>
        </b-table>
      </div>
    </div>
  </template>
  
  <script>
  import HelloWorld from './HelloWorld.vue'
  
  export default {
    name: 'WebinarManager',
    components: {
      HelloWorld
    },
    data() {
      return {
        isModalActive: false,
        activeStep: 0,
        formData: {
          eventName: '',
          orgName: '',
          eventDetails: '',
          contactName: '',
          contactEmail: '',
          webinarUrl: '',
          clientRedirectUrl: '',
          webinarRedirectUrl: '',
          schedule: null,
          videoQuality: '1080p',
          enableRecording: false
        },
        errors: {},
        webinarHistory: [],
        columns: [
          {
            field: 'eventName',
            label: 'Event Name'
          },
          {
            field: 'orgName',
            label: 'Organization'
          },
          {
            field: 'schedule',
            label: 'Schedule',
            renderHtml: true,
            formatter: (schedule) => {
              return schedule ? JSON.stringify(schedule) : 'No schedule'
            }
          },
          {
            field: 'videoSettings.quality',
            label: 'Video Quality'
          },
          {
            field: 'createdAt',
            label: 'Created',
            formatter: (date) => new Date(date).toLocaleDateString()
          }
        ]
      }
    },
    computed: {
      canProceed() {
        switch (this.activeStep) {
          case 0:
            return this.formData.eventName && 
                   this.formData.orgName && 
                   this.formData.contactName && 
                   this.formData.contactEmail &&
                   this.formData.webinarUrl
          case 1:
            return this.formData.schedule
          default:
            return true
        }
      },
      isFormValid() {
        return this.canProceed && this.formData.videoQuality
      }
    },
    methods: {
      openCreateModal() {
        this.isModalActive = true
      },
      nextStep() {
        if (this.canProceed) {
          this.activeStep++
        }
      },
      previousStep() {
        if (this.activeStep > 0) {
          this.activeStep--
        }
      },
      handleScheduleUpdate(schedule) {
        this.formData.schedule = schedule
      },
      validateForm() {
        this.errors = {}
        
        if (!this.formData.eventName) {
          this.errors.eventName = 'Event name is required'
        }
        
        return Object.keys(this.errors).length === 0
      },
      async handleSubmit() {
        if (!this.validateForm()) return
  
        try {
          // Create the webinar object with structured data
          const webinar = {
            id: Date.now(),
            eventName: this.formData.eventName,
            orgName: this.formData.orgName,
            eventDetails: this.formData.eventDetails,
            contact: {
              name: this.formData.contactName,
              email: this.formData.contactEmail
            },
            urls: {
              webinar: this.formData.webinarUrl,
              clientRedirect: this.formData.clientRedirectUrl,
              webinarRedirect: this.formData.webinarRedirectUrl
            },
            schedule: this.formData.schedule,
            videoSettings: {
              quality: this.formData.videoQuality,
              enableRecording: this.formData.enableRecording
            },
            createdAt: new Date().toISOString()
          }
  
          // Convert to formatted JSON string
          const jsonOutput = JSON.stringify(webinar, null, 2)
          
          // Log the JSON output
          console.log('Webinar Data:', jsonOutput)
  
          // Add to history
          this.webinarHistory.unshift(webinar)
          
          // Show success message
          this.$buefy.toast.open({
            message: 'Webinar created successfully!',
            type: 'is-success'
          })
          
          // Close modal and reset form
          this.isModalActive = false
          this.resetForm()
  
        } catch (error) {
          this.$buefy.toast.open({
            message: 'Error creating webinar',
            type: 'is-danger'
          })
        }
      },
      resetForm() {
        this.formData = {
          eventName: '',
          orgName: '',
          eventDetails: '',
          contactName: '',
          contactEmail: '',
          webinarUrl: '',
          clientRedirectUrl: '',
          webinarRedirectUrl: '',
          schedule: null,
          videoQuality: '1080p',
          enableRecording: false
        }
        this.activeStep = 0
        this.errors = {}
      }
    }
  }
  </script>
  
  <style scoped>
  .webinar-manager {
    padding: 2rem;
  }
  
  .header-section {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    position: relative;
  }
  
  .left-section {
    position: absolute;
    left: 0;
  }
  
  .title {
    margin: 0;
  }
  
  .footer-buttons {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
  
  .right-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .left-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .modal-card-foot {
    justify-content: space-between;
    padding: 1rem;
  }
  
  .step-content {
    padding: 1rem;
  }
  
  .modal-card-body {
    max-height: 70vh;
    overflow-y: auto;
  }
  </style>
  