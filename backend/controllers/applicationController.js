const Application = require('../models/Application');

exports.submitApplication = async (req, res) => {
    try {
        const { nid, monthlyIncome, familySize } = req.body;

        // ১. Anti-Fraud: NID চেক
        const existingApp = await Application.findOne({ nid });
        if (existingApp) {
            return res.status(400).json({ msg: 'This NID has already been used for an application.' });
        }

        // ২. Scoring Logic: (সহজ লজিক: ইনকাম যত কম, স্কোর তত বেশি)
        // আমরা ১০০০ কে ইনকাম দিয়ে ভাগ করে ফ্যামিলি সাইজ দিয়ে গুণ করছি
        const score = ((10000 / monthlyIncome) * familySize).toFixed(2);

        const newApplication = new Application({
            user: req.user.id, // এটি টোকেন থেকে আসবে
            nid,
            monthlyIncome,
            familySize,
            priorityScore: score
        });

        await newApplication.save();
        res.status(201).json({ msg: 'Application submitted successfully!', score });
    } catch (err) {
        res.status(500).json({ error: 'Server Error: ' + err.message });
    }
};