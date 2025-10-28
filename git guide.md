# GIT DIRECTIVES
## 1.  Add Your Files (if any)
git add .
git commit -m "Initial commit"
## 2. Add Remote GitHub Repository
git remote add origin https://github.com/EhsanLasani/llp1.git

### 3. If your GitHub repo already has files (like a README), you may need to pull first:
git pull origin main --allow-unrelated-histories
git push -u origin main


# Step-by-Step: Add llp1 as a Submodule to ProjectWebsite
git clone https://github.com/EhsanLasani/ProjectWebsite.git
cd ProjectWebsite
## Add llp1 as a Submodule
git submodule add https://github.com/EhsanLasani/llp1.git llp1
### Commit the Changes
git add .gitmodules llp1
git commit -m "Added llp1 as a submodule"
git push

## To Clone the Project with Submodules Later
git clone --recurse-submodules https://github.com/EhsanLasani/ProjectWebsite.git
### if already cloned:
git submodule init
git submodule update