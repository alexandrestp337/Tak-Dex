"""Stage a reviewed V77 commit for the isolated static host."""
import argparse
import html
import io
import json
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parents[2]
BRANCH = 'v77-development'


def git(*args):
    return subprocess.check_output(['git', '-C', ROOT, *args])


def public_asset(name):
    path = Path(name)
    if path.parts[0] == 'db74':
        return len(path.parts) == 2 and path.suffix == '.json'
    return len(path.parts) == 1 and (
        name in {'index.html', 'manifest.webmanifest'} or
        path.suffix in {'.js', '.css', '.jpg', '.png', '.webp'}
    )


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('commit')
    parser.add_argument('site', type=Path)
    parser.add_argument('origin', help='Dedicated preview URL')
    parser.add_argument('--branch', choices=[BRANCH, 'v77.1-maintenance', 'v77.2-development'], default=BRANCH)
    args = parser.parse_args()
    commit = git('rev-parse', '--verify', args.commit + '^{commit}').decode().strip()
    subprocess.run(['git', '-C', ROOT, 'merge-base', '--is-ancestor', commit, args.branch], check=True)
    origin = args.origin.rstrip('/')
    if not re.fullmatch(r'https://[a-z0-9.-]+', origin) or origin.endswith('.github.io'):
        parser.error('Pass the dedicated HTTPS preview origin.')
    if json.loads((args.site / '.openai/hosting.json').read_text())['static']['directory'] != 'dist':
        parser.error('The Site must serve its dist directory.')
    dist = args.site / 'dist'
    dist.mkdir(exist_ok=True)
    if any(path.is_symlink() for path in dist.rglob('*')):
        parser.error('Remove symlinks from the static staging directory.')
    paths = [p for p in git('ls-tree', '-rz', '--name-only', commit).decode().split('\0') if p and public_asset(p)]
    archive = git('archive', commit, '--', *paths)
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        tar.extractall(dist, filter='data')
    index = dist / 'index.html'
    contents = index.read_text()
    contents = contents.replace('https://alexandrestp337.github.io/Tak-Dex/', origin + '/')
    contents = contents.replace('<title>', '<meta name="robots" content="noindex, nofollow">\n<title>Development preview · ')
    version = re.search(r'<meta name="takdex-version" content="([^"]+)">', contents).group(1)
    banner = 'Development preview · ' + html.escape(version) + ' · ' + html.escape(commit[:12])
    contents = contents.replace(
        '<body>',
        '<body>\n<div role="note" style="padding:6px;text-align:center;font-size:.78rem;'
        'border-bottom:1px solid var(--edge)">' + banner + '</div>',
        1,
    )
    assert banner in contents
    index.write_text(contents)
    worker = dist / 'sw.js'
    worker.write_text(re.sub(r"const NAME='[^']+'", f"const NAME='takdex-v77-preview-{commit[:12]}'", worker.read_text(), count=1))
    (dist / 'preview-build.json').write_text(json.dumps({'branch': args.branch, 'commit': commit}) + '\n')
    print(commit)


if __name__ == '__main__':
    main()
