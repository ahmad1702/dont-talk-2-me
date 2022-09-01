import { SunIcon } from '@heroicons/react/24/solid';
import { Avatar, Button, Dropdown, Link, Navbar, Text, useTheme } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { UserContext } from '../Auth/UserProvider';
type Props = {}

const CustomNav = (props: Props) => {
    const { setTheme } = useNextTheme();
    const { isDark, type } = useTheme();
    const router = useRouter()
    const { currentUser, setCurrentUser } = useContext(UserContext);

    const collapseItems = [
        "Profile",
        "Dashboard",
        "Activity",
        "Analytics",
        "System",
        "Deployments",
        "My Settings",
        "Team Settings",
        "Help & Feedback",
        "Log Out",
    ];

    const logout = () => {
        setCurrentUser(undefined)
        localStorage.setItem('user', '')
        router.push('/login')
    }
    return (
        <Navbar css={isDark ? {} : { background: 'rgba(256,256,256, 0)', }} className='w-screen max-w-none'>
            <Navbar.Toggle showIn="sm" />
            <Navbar.Brand
                css={{
                    "@xs": {
                        w: "12%",
                    },
                }}
            >
                <div className='text-2xl font-extrabold'>
                    ✌️ DontTalk2Me
                </div>
            </Navbar.Brand>
            <Navbar.Content
                enableCursorHighlight
                activeColor="warning"
                hideIn="sm"
                variant="highlight"
            >
                <Navbar.Link href="#">Features</Navbar.Link>
                <Navbar.Link isActive href="#">
                    Customers
                </Navbar.Link>
                <Navbar.Link href="#">Pricing</Navbar.Link>
                <Navbar.Link href="#">Company</Navbar.Link>
            </Navbar.Content>
            <Navbar.Content
                css={{
                    "@xs": {
                        w: "12%",
                        jc: "flex-end",
                    },
                }}
            >
                <Dropdown placement="bottom-right">
                    <Navbar.Item>
                        <div className='flex items-center'>
                            <Button
                                auto
                                className='bg-yellow-500/30 text-yellow-700 dark:bg-neutral-500/50 dark:text-white hover:bg-yellow-500/60 hover:dark:bg-neutral-500/90 mr-3 z-0'
                                onClick={(e) => setTheme(type === 'light' ? 'dark' : 'light')}
                                icon={<SunIcon className="h-5 w-5" />}
                                aria-label='Toggle Dark Theme'
                            />
                            <Dropdown.Trigger>
                                <Avatar
                                    bordered
                                    as="button"
                                    color="warning"
                                    size="md"
                                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                                />
                            </Dropdown.Trigger>
                        </div>
                    </Navbar.Item>
                    <Dropdown.Menu
                        aria-label="User menu actions"
                        color="warning"
                        onAction={(actionKey) => console.log({ actionKey })}
                    >
                        <Dropdown.Item key="profile" css={{ height: "$18" }}>
                            <Text b color="inherit" css={{ d: "flex" }}>
                                Signed in as
                            </Text>
                            <Text b color="inherit" css={{ d: "flex" }}>
                                {currentUser?.username}
                            </Text>
                        </Dropdown.Item>
                        {/* <Dropdown.Item key="settings" withDivider>
                            My Settings
                        </Dropdown.Item>
                        <Dropdown.Item key="team_settings">Team Settings</Dropdown.Item>
                        <Dropdown.Item key="analytics" withDivider>
                            Analytics
                        </Dropdown.Item>
                        <Dropdown.Item key="system">System</Dropdown.Item>
                        <Dropdown.Item key="configurations">Configurations</Dropdown.Item>
                        <Dropdown.Item key="help_and_feedback" withDivider>
                            Help & Feedback
                        </Dropdown.Item> */}
                        <Dropdown.Item key="logout" withDivider color="error">
                            <div onClick={logout} className='w-full h-full'>Log Out</div>
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar.Content>
            <Navbar.Collapse disableAnimation>
                {collapseItems.map((item, index) => (
                    <Navbar.CollapseItem
                        key={item}
                        activeColor="warning"
                        css={{
                            color: index === collapseItems.length - 1 ? "$error" : "",
                        }}
                        isActive={index === 2}
                    >
                        <Link
                            color="inherit"
                            css={{
                                minWidth: "100%",
                            }}
                            href="#"
                        >
                            {item}
                        </Link>
                    </Navbar.CollapseItem>
                ))}
            </Navbar.Collapse>
        </Navbar>
    )
}

export default CustomNav