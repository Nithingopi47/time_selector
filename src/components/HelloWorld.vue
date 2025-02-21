<template>
  <div class="page-container">
    <div class="schedule-container">
      <section class="section">
        <!-- Timezone Selector -->
        <b-field label="Time Zone">
          <b-select v-model="selectedTimezone" placeholder="Select a timezone" expanded>
            <option v-for="tz in timezones" :key="tz" :value="tz">{{ tz }}</option>
          </b-select>
        </b-field>

        <!-- Schedule Type Tabs -->
        <b-tabs v-model="activeTab" class="mt-4">
          <!-- Specific Dates Tab -->
          <b-tab-item label="Specific Dates" icon="calendar-day">
            <div class="mt-4">
              <div v-for="(date, index) in specificDates" :key="index" class="mb-4">
                <b-field grouped>
                  <b-field label="Date">
                    <b-datepicker
                      v-model="date.date"
                      placeholder="Select date"
                      :min-date="new Date()"
                    ></b-datepicker>
                  </b-field>
                  <b-field label="Time">
                    <b-timepicker
                      v-model="date.time"
                      placeholder="Select time"
                      :hour-format="24"
                      :increment-minutes="15"
                      :minutes-step="15"
                      icon="clock"
                      editable
                    >
                    </b-timepicker>
                  </b-field>
                  <div class="field">
                    <label class="label">&nbsp;</label>
                    <button class="button is-danger" @click="removeSpecificDate(index)">
                      <b-icon icon="trash"></b-icon>
                    </button>
                  </div>
                </b-field>
              </div>
              <b-button type="is-primary" @click="addSpecificDate">
                <b-icon icon="plus"></b-icon>
                <span>Add Date</span>
              </b-button>
            </div>
          </b-tab-item>

          <!-- Daily Tab -->
          <b-tab-item label="Daily" icon="calendar">
            <div class="mt-4">
              <b-field grouped>
                <b-field label="Start Date">
                  <b-datepicker
                    v-model="dailySchedule.startDate"
                    placeholder="Start date"
                    :min-date="new Date()"
                  ></b-datepicker>
                </b-field>
                <b-field label="End Date">
                  <b-datepicker
                    v-model="dailySchedule.endDate"
                    placeholder="End date"
                    :min-date="dailySchedule.startDate || new Date()"
                  ></b-datepicker>
                </b-field>
              </b-field>

              <div v-for="(time, index) in dailySchedule.times" :key="index" class="mb-2">
                <b-field grouped>
                  <b-field label="Time">
                    <b-timepicker
                      v-model="time.value"
                      placeholder="Select time"
                      :hour-format="24"
                      :increment-minutes="15"
                      :minutes-step="15"
                      icon="clock"
                      editable
                    >
                    </b-timepicker>
                  </b-field>
                  <div class="field">
                    <label class="label">&nbsp;</label>
                    <button class="button is-danger" @click="removeDailyTime(index)">
                      <b-icon icon="trash"></b-icon>
                    </button>
                  </div>
                </b-field>
              </div>
              <b-button type="is-primary" @click="addDailyTime">
                <b-icon icon="plus"></b-icon>
                <span>Add Time</span>
              </b-button>
            </div>
          </b-tab-item>

          <!-- Weekly Tab -->
          <b-tab-item label="Weekly" icon="calendar-week">
            <div class="mt-4">
              <b-field grouped>
                <b-field label="Start Date">
                  <b-datepicker
                    v-model="weeklySchedule.startDate"
                    placeholder="Start date"
                    :min-date="new Date()"
                  ></b-datepicker>
                </b-field>
                <b-field label="End Date">
                  <b-datepicker
                    v-model="weeklySchedule.endDate"
                    placeholder="End date"
                    :min-date="weeklySchedule.startDate || new Date()"
                  ></b-datepicker>
                </b-field>
              </b-field>

              <b-field label="Days of Week">
                <b-checkbox-button
                  v-model="weeklySchedule.selectedDays"
                  v-for="day in weekDays"
                  :key="day.value"
                  :native-value="day.value"
                >
                  {{ day.label }}
                </b-checkbox-button>
              </b-field>

              <div v-for="(time, index) in weeklySchedule.times" :key="index" class="mb-2">
                <b-field grouped>
                  <b-field label="Time">
                    <b-timepicker
                      v-model="time.value"
                      placeholder="Select time"
                      :hour-format="24"
                      :increment-minutes="15"
                      :minutes-step="15"
                      icon="clock"
                      editable
                    >
                    </b-timepicker>
                  </b-field>
                  <div class="field">
                    <label class="label">&nbsp;</label>
                    <button class="button is-danger" @click="removeWeeklyTime(index)">
                      <b-icon icon="trash"></b-icon>
                    </button>
                  </div>
                </b-field>
              </div>
              <b-button type="is-primary" @click="addWeeklyTime">
                <b-icon icon="plus"></b-icon>
                <span>Add Time</span>
              </b-button>
            </div>
          </b-tab-item>
        </b-tabs>

        <!-- Submit Button -->
        <div class="mt-5 has-text-centered">
          <b-button
            type="is-success"
            @click="submitSchedule"
            :disabled="!isFormValid"
          >
            <b-icon icon="save"></b-icon>
            <span>Save Schedule</span>
          </b-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      activeTab: 0,
      selectedTimezone: '',
      timezones: Intl.supportedValuesOf('timeZone'),
      specificDates: [],
      dailySchedule: {
        startDate: null,
        endDate: null,
        times: []
      },
      weeklySchedule: {
        startDate: null,
        endDate: null,
        selectedDays: [],
        times: []
      },
      weekDays: [
        { label: 'Mon', value: 1 },
        { label: 'Tue', value: 2 },
        { label: 'Wed', value: 3 },
        { label: 'Thu', value: 4 },
        { label: 'Fri', value: 5 },
        { label: 'Sat', value: 6 },
        { label: 'Sun', value: 0 }
      ]
    }
  },
  created() {
    this.addSpecificDate();
    this.addDailyTime();
    this.addWeeklyTime();
  },
  computed: {
    scheduleType() {
      const types = ['specific', 'daily', 'weekly'];
      return types[this.activeTab];
    },
    isFormValid() {
      if (!this.selectedTimezone) return false;

      switch (this.scheduleType) {
        case 'specific':
          return this.specificDates.length > 0 && 
                 this.specificDates.every(d => d.date && d.time);
        case 'daily':
          return this.dailySchedule.startDate &&
                 this.dailySchedule.endDate &&
                 this.dailySchedule.times.length > 0 &&
                 this.dailySchedule.times.every(t => t.value);
        case 'weekly':
          return this.weeklySchedule.startDate &&
                 this.weeklySchedule.endDate &&
                 this.weeklySchedule.selectedDays.length > 0 &&
                 this.weeklySchedule.times.length > 0 &&
                 this.weeklySchedule.times.every(t => t.value);
        default:
          return false;
      }
    }
  },
  methods: {
    validateTimeInterval(time) {
      if (!time) return null;
      
      const minutes = time.getMinutes();
      const roundedMinutes = Math.round(minutes / 15) * 15;
      
      const newTime = new Date(time);
      if (roundedMinutes === 60) {
        newTime.setHours(time.getHours() + 1);
        newTime.setMinutes(0);
      } else {
        newTime.setMinutes(roundedMinutes);
      }
      
      return newTime;
    },
    formatTime(dateTimeObj) {
      if (!dateTimeObj) return null;
      const hours = dateTimeObj.getHours().toString().padStart(2, '0');
      const minutes = dateTimeObj.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    },
    formatDate(dateObj) {
      if (!dateObj) return null;
      const year = dateObj.getFullYear();
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const day = dateObj.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    addSpecificDate() {
      this.specificDates.push({ date: null, time: null });
    },
    removeSpecificDate(index) {
      if (this.specificDates.length > 1) {
        this.specificDates.splice(index, 1);
      }
    },
    addDailyTime() {
      this.dailySchedule.times.push({ value: null });
    },
    removeDailyTime(index) {
      if (this.dailySchedule.times.length > 1) {
        this.dailySchedule.times.splice(index, 1);
      }
    },
    addWeeklyTime() {
      this.weeklySchedule.times.push({ value: null });
    },
    removeWeeklyTime(index) {
      if (this.weeklySchedule.times.length > 1) {
        this.weeklySchedule.times.splice(index, 1);
      }
    },
    submitSchedule() {
      const schedule = {
        timezone: this.selectedTimezone,
        type: this.scheduleType,
        schedule: this.getScheduleData()
      };
      console.log('Schedule Data:', JSON.stringify(schedule, null, 2));
    },
    getScheduleData() {
      switch (this.scheduleType) {
        case 'specific':
          return {
            dates: this.specificDates.map(d => ({
              date: this.formatDate(d.date),
              time: this.formatTime(d.time)
            })).filter(d => d.date && d.time)
          };
        case 'daily':
          return {
            startDate: this.formatDate(this.dailySchedule.startDate),
            endDate: this.formatDate(this.dailySchedule.endDate),
            times: this.dailySchedule.times
              .map(t => this.formatTime(t.value))
              .filter(Boolean)
          };
        case 'weekly':
          return {
            startDate: this.formatDate(this.weeklySchedule.startDate),
            endDate: this.formatDate(this.weeklySchedule.endDate),
            days: this.weeklySchedule.selectedDays,
            times: this.weeklySchedule.times
              .map(t => this.formatTime(t.value))
              .filter(Boolean)
          };
      }
    }
  }
}
</script>

<style>
@import 'buefy/dist/buefy.css';

.page-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.schedule-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.section {
  padding: 2rem;
}

.b-timepicker {
  min-width: 200px;
}

.field {
  margin-bottom: 1rem;
}

.grouped {
  display: flex;
  gap: 1rem;
}

.b-checkbox-button {
  margin-right: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-5 {
  margin-top: 1.25rem;
}

.has-text-centered {
  text-align: center;
}
</style>
