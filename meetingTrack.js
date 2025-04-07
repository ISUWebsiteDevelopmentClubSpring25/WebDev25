document.addEventListener('DOMContentLoaded', function() {
    // Current semester password (should be changed each semester)
    const currentPassword = "Spring2024";
    
    // Store meetings in localStorage
    let meetings = JSON.parse(localStorage.getItem('webDevClubMeetings')) || [];
    
    // Get the meeting tracker container
    const meetingTracker = document.getElementById('meeting-tracker');
    
    // Create authentication section
    const authSection = document.createElement('div');
    authSection.id = 'auth-section';
    authSection.innerHTML = `
        <p>Enter the current semester password to post meeting summaries:</p>
        <input type="password" id="member-password" placeholder="Enter semester password">
        <button id="auth-btn">Authenticate</button>
        <p id="auth-error" class="error hidden">Incorrect password. Please try again.</p>
    `;
    meetingTracker.appendChild(authSection);
    
    // Create post form (initially hidden)
    const postForm = document.createElement('div');
    postForm.id = 'post-form';
    postForm.className = 'hidden';
    postForm.innerHTML = `
        <h3>Create New Meeting Summary</h3>
        <form id="meeting-form">
            <label for="meeting-date">Meeting Date:</label>
            <input type="date" id="meeting-date" required>
            
            <label for="meeting-title">Title:</label>
            <input type="text" id="meeting-title" placeholder="Enter meeting title:" required>
            
            <label for="meeting-summary">Summary:</label>
            <textarea id="meeting-summary" rows="7" placeholder="Enter meeting summary..." required></textarea>
            
            <button type="submit">Post Summary</button>
        </form>
    `;
    meetingTracker.appendChild(postForm);
    
    // Create recent meetings section (always shows last 3 meetings)
    const recentMeetings = document.createElement('div');
    recentMeetings.id = 'recent-meetings';
    meetingTracker.appendChild(recentMeetings);
    
    // Create "See More" button
    const seeMoreBtn = document.createElement('button');
    seeMoreBtn.id = 'see-more-btn';
    seeMoreBtn.textContent = 'See More';
    meetingTracker.appendChild(seeMoreBtn);
    
    //create "delete" button
    const deleteBtn = document.createElement('deleteBtn');
    deleteBtn.className = 'delete-btn';
    deleteBtn.id = 'delete-btn';
    deleteBtn.textContent = 'Delete Selected Meetings';
    meetingTracker.appendChild(deleteBtn);

    // Create container for all meetings with smooth expand/collapse
    const allMeetingsContainer = document.createElement('div');
    allMeetingsContainer.id = 'all-meetings-container';
    
    const allMeetings = document.createElement('div');
    allMeetings.id = 'all-meetings';
    allMeetingsContainer.appendChild(allMeetings);
    meetingTracker.appendChild(allMeetingsContainer);
    
    // Event listeners
    document.getElementById('auth-btn').addEventListener('click', authenticate);
    document.getElementById('meeting-form').addEventListener('submit', submitMeeting);
    document.getElementById('see-more-btn').addEventListener('click', toggleAllMeetings);
    //delete selected meetings
    document.getElementById('delete-btn').addEventListener('click', deleteMeeting);

    
    // Initialize display
    displayMeetings();
    
    // Functions
    function authenticate() {
        const passwordInput = document.getElementById('member-password');
        if (passwordInput.value === currentPassword) {
            postForm.classList.remove('hidden');
            authSection.classList.add('hidden');
        } else {
            document.getElementById('auth-error').classList.remove('hidden');
        }
    }

    function deleteMeeting() {
        const selectedMeetings = document.querySelectorAll('.meeting-checkbox:checked');
        if (selectedMeetings.length === 0) {
            alert('No meetings selected for deletion.');
            return;
        }
        
        selectedMeetings.forEach(meeting => {
            const meetingId = meeting.getAttribute('data-id');
            meetings = meetings.filter(m => m.id != meetingId);
        });
        
        localStorage.setItem('webDevClubMeetings', JSON.stringify(meetings));
        displayMeetings();
    }


    
    function submitMeeting(e) {
        e.preventDefault();
        
        const date = document.getElementById('meeting-date').value;
        const title = document.getElementById('meeting-title').value;
        const summary = document.getElementById('meeting-summary').value;
        
        const newMeeting = {
            id: Date.now(),
            date: date,
            title: title,
            summary: summary,
            timestamp: new Date().toISOString()
        };
        
        meetings.unshift(newMeeting);
        localStorage.setItem('webDevClubMeetings', JSON.stringify(meetings));
        
        document.getElementById('meeting-form').reset();
        displayMeetings();
        
        alert('Meeting summary posted successfully!');
    }
    
    function toggleAllMeetings() {
        const container = document.getElementById('all-meetings-container');
        container.classList.toggle('expanded');
        
        const btn = document.getElementById('see-more-btn');
        btn.textContent = container.classList.contains('expanded') ? 'See Less' : 'See More';
    }
    
    function displayMeetings() {
        recentMeetings.innerHTML = '';
        allMeetings.innerHTML = '';
        
        if (meetings.length === 0) {
            recentMeetings.innerHTML = '<p>No meetings found.</p>';
            allMeetings.innerHTML = '<p>No meetings found.</p>';
            document.getElementById('see-more-btn').style.display = 'none';
            return;
        }
        
        // Sort meetings by date (newest first)
        meetings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Always show the 3 most recent meetings
        const recentToShow = meetings.slice(0, 3);
        recentToShow.forEach(meeting => {
            recentMeetings.appendChild(createMeetingElement(meeting));
        });
        
        // Show all past meetings (excluding the 3 most recent) in the expandable section
        const pastMeetings = meetings.slice(3);
        if (pastMeetings.length > 0) {
            pastMeetings.forEach(meeting => {
                allMeetings.appendChild(createMeetingElement(meeting));
            });
            document.getElementById('see-more-btn').style.display = 'block';
        } else {
            document.getElementById('see-more-btn').style.display = 'none';
        }
    }
    
    function createMeetingElement(meeting) {
        const meetingEl = document.createElement('div');
        meetingEl.className = 'meeting';
        
        const date = new Date(meeting.date);
        const formattedDate = date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
        
        meetingEl.innerHTML = `
            <h4>${meeting.title}</h4>
            <p class="meeting-date">${formattedDate}</p>
            <p>${meeting.summary}</p>
            <hr>
        `;
        
        return meetingEl;
    }
    
    // Admin function to change password
    window.changeSemesterPassword = function(newPassword) {
        currentPassword = newPassword;
        console.log('Password changed for new semester.');
    };
});