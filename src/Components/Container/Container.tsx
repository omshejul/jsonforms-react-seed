import styles from './Container.module.css'
const Container = (props : any) => {
  return (
    <div className={styles.viewport}>
      <div className={styles.container}>
        {props.children}
      </div>
    </div>
  )
}

export default Container
