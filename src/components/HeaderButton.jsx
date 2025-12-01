export default function HeaderButton({href, headerText}) {
    return(
            <a className="header-text" href={href}>{headerText}</a>
    );
}