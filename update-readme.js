require('dotenv').config();

const axios = require('axios');

// GitHub username and personal access token
const username = 'leny62';
const token = process.env.GITHUB_TOKEN;

const fetchRepositories = async () => {
    const url = `https://api.github.com/users/${username}/repos?per_page=5&sort=created`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Awesome-App',
      },
    });
    return response.data;
  };
  
  // Generate markdown for projects
  const generateProjectsMarkdown = (repositories) => {
    let markdown = '';
    repositories.forEach((repo) => {
      markdown += `- [${repo.name}](${repo.html_url}) - ${repo.description}\n`;
    });
    return markdown;
  };
  
  // Update README.md with projects
  const updateReadme = async () => {
    const repositories = await fetchRepositories();
    const projectsMarkdown = generateProjectsMarkdown(repositories);
    const readmeUrl = `https://api.github.com/repos/${username}/${username}/contents/README.md`;
    const readmeResponse = await axios.get(readmeUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Awesome-App',
      },
    });
    const readme = readmeResponse.data;
    const updatedReadmeContent = readme.content.replace(
      '<!--START_SECTION:projects-->',
      `<!--START_SECTION:projects-->\n${projectsMarkdown}`
    );
    await axios.put(readmeUrl, {
      message: 'Update recent projects',
      content: updatedReadmeContent,
      sha: readme.sha,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'Awesome-App',
      },
    });
  };
  
  // Update the README.md
  updateReadme();
