import { MilestoneService } from "../service";

const addMilestone = async (req, res, next) => {
    const { title, description, dueDate } = req.body;

    try {
        const milestoneService = MilestoneService.getInstance();
        await milestoneService.addMilestone({ title, description, dueDate });
        res.status(201).end();
    } catch (error) {
        next(error);
    }
};

const getMilestones = async (req, res, next) => {
    try {
        const milestoneService = MilestoneService.getInstance();
        const receivedMilestones = await milestoneService.getMilestones();
        const milestones = receivedMilestones.map(({ id, title, state, description, dueDate, updatedAt, issues }) => {
            const [openIssueCount, closedIssueCount] = issues.reduce(
                (acc, cur) => {
                    if (cur.state === "open") return [acc[0] + 1, acc[1]];
                    return [acc[0], acc[1] + 1];
                },
                [0, 0]
            );
            return {
                id,
                title,
                state,
                description,
                dueDate,
                updatedAt,
                openIssueCount,
                closedIssueCount
            };
        });
        const [openMilestoneCount, closeMilestoneCount] = milestones.reduce(
            (acc, cur) => {
                if (cur.state === "open") return [acc[0] + 1, acc[1]];
                return [acc[0], acc[1] + 1];
            },
            [0, 0]
        );

        res.status(200).send({ milestones, openMilestoneCount, closeMilestoneCount });
    } catch (error) {
        next(error);
    }
};

const getMilestone = async (req, res, next) => {
    const { milestoneId } = req.params;

    try {
        const milestoneService = MilestoneService.getInstance();
        const milestone = await milestoneService.getMilestone(milestoneId);
        res.status(200).send({ milestone });
    } catch (error) {
        next(error);
    }
};

export { addMilestone, getMilestones, getMilestone };
