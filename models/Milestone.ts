import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    createdAt: { type: Date, default: Date.now },
});

const MilestoneModel = mongoose.model('Milestone', milestoneSchema);

export default MilestoneModel;