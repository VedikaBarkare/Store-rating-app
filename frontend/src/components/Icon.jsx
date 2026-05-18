function Icon({ name, style = "solid", className = "", ...props }) {
  const styleClass = style === "regular" ? "fa-regular" : style === "brands" ? "fa-brands" : "fa-solid";
  const classes = `${styleClass} fa-${name} ${className}`.trim();

  return <i className={classes} aria-hidden="true" {...props} />;
}

export default Icon;
