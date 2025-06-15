import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  magic_id: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },

  courses: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the course model
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      finished: {
        type: Boolean,
        default: false,
      },
      startedAt: {
        type: Date,
      },
      finishedAt: {
        type: Date,
      },
      timeTaken:{
        type: Number,
        default: 0,
      }
    },
  ],

  quizzes: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Reference to the course model
        required: true,
      },
      title: {
        type: String,
      },
      quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz', // Reference to the quiz model
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
      takenAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const User = mongoose.model('User', UserSchema);