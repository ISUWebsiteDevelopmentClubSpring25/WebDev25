document.addEventListener('DOMContentLoaded', function() {
    // Current semester password (should be changed each semester)
    const currentPassword = "Spring2024";
    let isAuthenticated = false;
    
    // Retrieve meetings from localStorage or initialize empty array
    let meetings = JSON.parse(localStorage.getItem('webDevClubMeetings')) || [];
    
    // Get the meeting tracker container
    const meetingTracker = document.getElementById('meeting-tracker');
    
    // ======================
    // 1. AUTHENTICATION SECTION
    // ======================
    const authSection = document.createElement('div');
    authSection.id = 'auth-section';
    authSection.innerHTML = `
        <p>Enter the current semester password to post meeting summaries:</p>
        <input type="password" id="member-password" placeholder="Enter semester password">
        <button id="auth-btn">Authenticate</button>
        <p id="auth-error" class="error hidden">Incorrect password. Please try again.</p>
    `;
    meetingTracker.appendChild(authSection);

    // ======================
    // 2. POST FORM (HIDDEN BY DEFAULT)
    // ======================
    const postForm = document.createElement('div');
    postForm.id = 'post-form';
    postForm.className = 'hidden';
    postForm.innerHTML = `
        <h3>Create New Meeting Summary</h3>
        <form id="meeting-form">
            <label for="meeting-date">Meeting Date:</label>
            <input type="date" id="meeting-date" required>
            
            <label for="meeting-title">Title:</label>
            <input type="text" id="meeting-title" placeholder="Enter meeting title" required>
            
            <label for="meeting-summary">Summary:</label>
            <textarea id="meeting-summary" rows="5" placeholder="Enter meeting summary" required></textarea>
            
            <button type="submit">Post Summary</button>
        </form>
    `;
    meetingTracker.appendChild(postForm);

    // ======================
    // 3. RECENT MEETINGS (ALWAYS VISIBLE)
    // ======================
    const recentMeetings = document.createElement('div');
    recentMeetings.id = 'recent-meetings';
    meetingTracker.appendChild(recentMeetings);

    // ======================
    // 4. "SEE MORE" BUTTON (HIDDEN BY DEFAULT)
    // ======================
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.id = 'see-more-btn';
    seeMoreBtn.textContent = 'See More';
    seeMoreBtn.style.display = 'none';
    meetingTracker.appendChild(seeMoreBtn);

    // ======================
    // 5. ALL MEETINGS CONTAINER (HIDDEN BY DEFAULT)
    // ======================
    const allMeetingsContainer = document.createElement('div');
    allMeetingsContainer.id = 'all-meetings-container';
    allMeetingsContainer.style.display = 'none'; // Initially hidden
    
    const allMeetings = document.createElement('div');
    allMeetings.id = 'all-meetings';
    allMeetingsContainer.appendChild(allMeetings);
    meetingTracker.appendChild(allMeetingsContainer);

    // ======================
    // EVENT LISTENERS
    // ======================
    document.getElementById('auth-btn').addEventListener('click', authenticate);
    seeMoreBtn.addEventListener('click', toggleAllMeetings);

    // Initialize meetings display
    displayMeetings();

    // ======================
    // FUNCTIONS
    // ======================
    function authenticate() {
        const passwordInput = document.getElementById('member-password').value;
        const errorEl = document.getElementById('auth-error');

        if (passwordInput === currentPassword) {
            isAuthenticated = true;
            postForm.classList.remove('hidden');
            authSection.classList.add('hidden');
            // Enable form submission
            document.getElementById('meeting-form').addEventListener('submit', submitMeeting);
        } else {
            errorEl.classList.remove('hidden');
        }
    }

    function submitMeeting(e) {
        e.preventDefault();
        
        if (!isAuthenticated) {
            alert("Authentication required!");
            return;
        }

        const newMeeting = {
            id: Date.now(),
            date: document.getElementById('meeting-date').value,
            title: document.getElementById('meeting-title').value,
            summary: document.getElementById('meeting-summary').value,
            timestamp: new Date().toISOString()
        };

        meetings.unshift(newMeeting);
        localStorage.setItem('webDevClubMeetings', JSON.stringify(meetings));
        document.getElementById('meeting-form').reset();
        displayMeetings();
        alert("Meeting posted successfully!");
    }

    function toggleAllMeetings() {
        const isHidden = allMeetingsContainer.style.display === 'none';
        allMeetingsContainer.style.display = isHidden ? 'block' : 'none';
        seeMoreBtn.textContent = isHidden ? 'See Less' : 'See More';
    }

    function displayMeetings() {
        recentMeetings.innerHTML = '';
        allMeetings.innerHTML = '';

        if (meetings.length === 0) {
            recentMeetings.innerHTML = '<p>No meetings found.</p>';
            seeMoreBtn.style.display = 'none';
            return;
        }

        // Sort meetings (newest first)
        meetings.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Show 3 most recent
        const recentToShow = meetings.slice(0, 3);
        recentToShow.forEach(meeting => {
            recentMeetings.appendChild(createMeetingElement(meeting));
        });

        // Show the rest (if any)
        const pastMeetings = meetings.slice(3);
        if (pastMeetings.length > 0) {
            pastMeetings.forEach(meeting => {
                allMeetings.appendChild(createMeetingElement(meeting));
            });
            seeMoreBtn.style.display = 'block'; // Show "See More" if extra meetings exist
        } else {
            seeMoreBtn.style.display = 'none';
        }
    }

    function createMeetingElement(meeting) {
        const meetingEl = document.createElement('div');
        meetingEl.className = 'meeting';
        meetingEl.innerHTML = `
            <h3>${meeting.title}</h3>
            <p class="meeting-date">${new Date(meeting.date).toLocaleDateString('en-US')}</p>
            <p>${meeting.summary}</p>
            <hr>
        `;
        return meetingEl;
    }

    // Admin function to change password
    window.changeSemesterPassword = function(newPassword) {
        currentPassword = newPassword;
        console.log('Password updated for new semester.');
    };
});