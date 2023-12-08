document.addEventListener('DOMContentLoaded', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (!currentTab) return;

        var url = currentTab.url;
        document.getElementById('linkDisplay').textContent = url;

        // Extract and display YouTube video ID
        var videoId = extractYoutubeVideoId(url);
        if (videoId) {
            document.getElementById('youtubeCheck').textContent = `Yes, we're on YouTube. Video ID: ${videoId}`;
            document.getElementById('downloadBtn').addEventListener('click', function () {
                downloadYoutubeVideo(videoId);
            });
        } else {
            document.getElementById('youtubeCheck').textContent = "No, this is not YouTube";
        }
    });
});

function extractYoutubeVideoId(url) {
    var match = url.match(/[?&]v=([^&]+)/);
    return match ? match[1] : null;
}

function downloadYoutubeVideo(videoId) {
    if (!videoId) {
        alert("YouTube video ID not found.");
        return;
    }

    // Correctly format the API URL with the video ID
    const apiUrl = `https://ytstream-download-youtube-videos.p.rapidapi.com/dl?id=${videoId}`;
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'YOUR-API-KEY',
            'X-RapidAPI-Host': 'ytstream-download-youtube-videos.p.rapidapi.com',
        }
    })
    .then(response => response.json())
    .then(data => {
        displayVideoFormats(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function displayVideoFormats(data) {
    if (!data.formats || !Array.isArray(data.formats)) {
        console.error('Invalid or no formats available');
        return;
    }

    const formatsContainer = document.createElement('div');
    data.formats.forEach(format => {
        if (['144p', '360p', '720p'].includes(format.qualityLabel)) {
            const link = document.createElement('a');
            link.href = format.url;
            link.textContent = `${format.qualityLabel} (Right-click to download)`;
            link.target = '_blank';
            formatsContainer.appendChild(link);
            formatsContainer.appendChild(document.createElement('br'));
        }
    });

    const responseContainer = document.getElementById('responseContainer');
    responseContainer.innerHTML = '';
    responseContainer.appendChild(formatsContainer);
}
